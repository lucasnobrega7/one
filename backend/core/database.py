"""
Database Layer Otimizada para Agentes de Conversão
Implementa Repository pattern, query optimization e transaction management
"""

import asyncio
import logging
from typing import Optional, List, Dict, Any, Union, Type, TypeVar
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from decimal import Decimal

from prisma import Prisma, models
from prisma.types import OrganizationInclude, AgentInclude, ConversationInclude
import asyncpg
from pydantic import BaseModel
import redis.asyncio as redis

# Type variables
T = TypeVar('T', bound=BaseModel)
ModelType = TypeVar('ModelType')

logger = logging.getLogger(__name__)

class DatabaseConfig:
    """Configuração otimizada do banco de dados"""
    
    # Connection pooling
    MIN_CONNECTIONS = 5
    MAX_CONNECTIONS = 20
    CONNECTION_TIMEOUT = 30
    
    # Query optimization
    DEFAULT_LIMIT = 50
    MAX_LIMIT = 1000
    
    # Cache settings
    CACHE_TTL = 300  # 5 minutos
    CACHE_PREFIX = "ac:"  # Agentes de Conversão

class DatabaseError(Exception):
    """Exceções customizadas do banco"""
    pass

class OptimizedPrismaClient:
    """Cliente Prisma otimizado com connection pooling e cache"""
    
    def __init__(self):
        self.client = Prisma()
        self.redis_client: Optional[redis.Redis] = None
        self._connection_pool: Optional[asyncpg.Pool] = None
        self.config = DatabaseConfig()
        
    async def connect(self):
        """Conecta ao banco com configurações otimizadas"""
        try:
            await self.client.connect()
            
            # Configurar Redis para cache
            try:
                import os
                redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
                self.redis_client = redis.from_url(redis_url)
                await self.redis_client.ping()
                logger.info("Redis cache conectado com sucesso")
            except Exception as e:
                logger.warning(f"Redis cache não disponível: {e}")
                
            # Configurar connection pool para raw queries
            database_url = os.getenv("DIRECT_URL")
            if database_url:
                self._connection_pool = await asyncpg.create_pool(
                    database_url,
                    min_size=self.config.MIN_CONNECTIONS,
                    max_size=self.config.MAX_CONNECTIONS,
                    command_timeout=self.config.CONNECTION_TIMEOUT
                )
                
            logger.info("Database conectado com sucesso")
            
        except Exception as e:
            logger.error(f"Erro ao conectar database: {e}")
            raise DatabaseError(f"Falha na conexão: {e}")
    
    async def disconnect(self):
        """Desconecta do banco"""
        try:
            if self.redis_client:
                await self.redis_client.close()
            if self._connection_pool:
                await self._connection_pool.close()
            await self.client.disconnect()
            logger.info("Database desconectado")
        except Exception as e:
            logger.error(f"Erro ao desconectar: {e}")
    
    @asynccontextmanager
    async def transaction(self):
        """Context manager para transações"""
        async with self.client.tx() as transaction:
            try:
                yield transaction
            except Exception as e:
                logger.error(f"Erro na transação: {e}")
                raise DatabaseError(f"Transação falhou: {e}")
    
    async def execute_raw(self, query: str, *args) -> List[Dict[str, Any]]:
        """Executa query raw otimizada"""
        if not self._connection_pool:
            raise DatabaseError("Connection pool não inicializado")
            
        async with self._connection_pool.acquire() as connection:
            try:
                result = await connection.fetch(query, *args)
                return [dict(row) for row in result]
            except Exception as e:
                logger.error(f"Erro na query raw: {e}")
                raise DatabaseError(f"Query falhou: {e}")
    
    async def cache_get(self, key: str) -> Optional[str]:
        """Busca no cache Redis"""
        if not self.redis_client:
            return None
        try:
            return await self.redis_client.get(f"{self.config.CACHE_PREFIX}{key}")
        except Exception as e:
            logger.warning(f"Erro no cache get: {e}")
            return None
    
    async def cache_set(self, key: str, value: str, ttl: int = None) -> bool:
        """Salva no cache Redis"""
        if not self.redis_client:
            return False
        try:
            ttl = ttl or self.config.CACHE_TTL
            await self.redis_client.setex(f"{self.config.CACHE_PREFIX}{key}", ttl, value)
            return True
        except Exception as e:
            logger.warning(f"Erro no cache set: {e}")
            return False

# Instância global otimizada
db = OptimizedPrismaClient()

class BaseRepository:
    """Repository base com operações comuns otimizadas"""
    
    def __init__(self, client: OptimizedPrismaClient):
        self.client = client
        self.db = client.client
    
    def _apply_pagination(self, skip: int = 0, take: int = None) -> Dict[str, int]:
        """Aplica paginação com limites seguros"""
        take = min(take or DatabaseConfig.DEFAULT_LIMIT, DatabaseConfig.MAX_LIMIT)
        return {"skip": skip, "take": take}
    
    def _build_where_clause(self, organization_id: str, extra_filters: Dict = None) -> Dict:
        """Constrói cláusula WHERE com isolamento por organização"""
        where = {"organization_id": organization_id}
        if extra_filters:
            where.update(extra_filters)
        return where

class OrganizationRepository(BaseRepository):
    """Repository otimizado para Organizations"""
    
    async def get_by_id(self, org_id: str, include_stats: bool = False) -> Optional[models.Organization]:
        """Busca organização por ID com includes otimizados"""
        include_config = {
            "memberships": {
                "include": {"user": {"select": {"id": True, "name": True, "email": True}}}
            },
            "usage": True
        }
        
        if include_stats:
            include_config.update({
                "agents": {"select": {"id": True, "name": True, "is_active": True}},
                "_count": {"select": {"agents": True, "datastores": True}}
            })
        
        return await self.db.organization.find_unique(
            where={"id": org_id},
            include=include_config
        )
    
    async def get_user_organizations(self, user_id: str) -> List[models.Organization]:
        """Lista organizações do usuário com dados otimizados"""
        return await self.db.organization.find_many(
            where={
                "memberships": {
                    "some": {"user_id": user_id}
                }
            },
            include={
                "memberships": {
                    "where": {"user_id": user_id},
                    "select": {"role": True}
                },
                "usage": {"select": {"nbAgentQueries": True, "nbModelTokens": True}},
                "_count": {"select": {"agents": True, "datastores": True}}
            },
            order_by={"created_at": "asc"}
        )
    
    async def create_with_owner(self, name: str, user_id: str, icon_url: str = None) -> models.Organization:
        """Cria organização com owner em transação"""
        async with self.client.transaction() as tx:
            # Criar organização
            org = await tx.organization.create({
                "name": name,
                "icon_url": icon_url
            })
            
            # Criar membership de owner
            await tx.membership.create({
                "organization_id": org.id,
                "user_id": user_id,
                "role": "OWNER"
            })
            
            # Criar usage tracking
            await tx.usage.create({
                "organization_id": org.id
            })
            
            return org

class AgentRepository(BaseRepository):
    """Repository otimizado para Agents"""
    
    async def get_by_organization(
        self, 
        organization_id: str, 
        skip: int = 0, 
        take: int = None,
        include_stats: bool = False
    ) -> List[models.Agent]:
        """Lista agentes da organização com paginação"""
        
        include_config = {
            "datastore": {"select": {"id": True, "name": True, "type": True}},
            "_count": {"select": {"conversations": True}} if include_stats else False
        }
        
        pagination = self._apply_pagination(skip, take)
        
        return await self.db.agent.find_many(
            where={"organization_id": organization_id},
            include=include_config,
            order_by={"updated_at": "desc"},
            **pagination
        )
    
    async def get_with_analytics(self, agent_id: str, organization_id: str) -> Optional[models.Agent]:
        """Busca agente com dados de analytics"""
        return await self.db.agent.find_unique(
            where={"id": agent_id, "organization_id": organization_id},
            include={
                "datastore": True,
                "conversations": {
                    "select": {"id": True, "created_at": True, "status": True},
                    "order_by": {"created_at": "desc"},
                    "take": 10
                },
                "_count": {"select": {"conversations": True}}
            }
        )
    
    async def update_config(
        self, 
        agent_id: str, 
        organization_id: str, 
        updates: Dict[str, Any]
    ) -> Optional[models.Agent]:
        """Atualiza configuração do agente com validação"""
        
        # Validar se agente pertence à organização
        agent = await self.db.agent.find_unique(
            where={"id": agent_id, "organization_id": organization_id}
        )
        
        if not agent:
            return None
        
        return await self.db.agent.update(
            where={"id": agent_id},
            data=updates
        )

class ConversationRepository(BaseRepository):
    """Repository otimizado para Conversations"""
    
    async def get_by_organization(
        self,
        organization_id: str,
        skip: int = 0,
        take: int = None,
        status_filter: str = None
    ) -> List[models.Conversation]:
        """Lista conversas da organização via agentes"""
        
        where_clause = {
            "agent": {"organization_id": organization_id}
        }
        
        if status_filter:
            where_clause["status"] = status_filter
        
        pagination = self._apply_pagination(skip, take)
        
        return await self.db.conversation.find_many(
            where=where_clause,
            include={
                "agent": {"select": {"id": True, "name": True}},
                "user": {"select": {"id": True, "name": True, "email": True}},
                "_count": {"select": {"messages": True}}
            },
            order_by={"updated_at": "desc"},
            **pagination
        )
    
    async def get_with_messages(
        self, 
        conversation_id: str, 
        organization_id: str,
        message_limit: int = 50
    ) -> Optional[models.Conversation]:
        """Busca conversa com mensagens paginadas"""
        
        return await self.db.conversation.find_unique(
            where={
                "id": conversation_id,
                "agent": {"organization_id": organization_id}
            },
            include={
                "agent": {"select": {"id": True, "name": True}},
                "user": {"select": {"id": True, "name": True}},
                "messages": {
                    "order_by": {"created_at": "asc"},
                    "take": message_limit
                }
            }
        )
    
    async def get_analytics_data(
        self,
        organization_id: str,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """Busca dados de analytics com query raw otimizada"""
        
        query = """
        SELECT 
            DATE(c.created_at) as date,
            COUNT(c.id) as conversation_count,
            COUNT(DISTINCT c.user_id) as unique_users,
            AVG(msg_count.count) as avg_messages_per_conversation,
            SUM(msg_count.tokens) as total_tokens
        FROM conversations c
        INNER JOIN agents a ON c.agent_id = a.id
        LEFT JOIN (
            SELECT 
                conversation_id,
                COUNT(*) as count,
                SUM(COALESCE(tokens_used, 0)) as tokens
            FROM messages 
            GROUP BY conversation_id
        ) msg_count ON c.id = msg_count.conversation_id
        WHERE a.organization_id = $1 
        AND c.created_at >= $2 
        AND c.created_at <= $3
        GROUP BY DATE(c.created_at)
        ORDER BY date DESC
        """
        
        return await self.client.execute_raw(query, organization_id, start_date, end_date)

class UsageRepository(BaseRepository):
    """Repository para tracking de uso"""
    
    async def increment_usage(
        self,
        organization_id: str,
        query_count: int = 0,
        token_count: int = 0,
        data_processed: int = 0
    ) -> models.Usage:
        """Incrementa contadores de uso atomicamente"""
        
        return await self.db.usage.upsert(
            where={"organization_id": organization_id},
            data={
                "organization_id": organization_id,
                "nbAgentQueries": {"increment": query_count},
                "nbModelTokens": {"increment": token_count},
                "nbDataProcessed": {"increment": data_processed}
            },
            create={
                "organization_id": organization_id,
                "nbAgentQueries": query_count,
                "nbModelTokens": token_count,
                "nbDataProcessed": data_processed
            }
        )
    
    async def get_usage_summary(
        self,
        organization_id: str,
        period_days: int = 30
    ) -> Dict[str, Any]:
        """Resumo de uso com comparação de período"""
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=period_days)
        
        query = """
        WITH period_usage AS (
            SELECT 
                SUM(CASE WHEN au.timestamp >= $2 THEN COALESCE(au.tokens_used, 0) ELSE 0 END) as current_tokens,
                SUM(CASE WHEN au.timestamp < $2 THEN COALESCE(au.tokens_used, 0) ELSE 0 END) as previous_tokens,
                COUNT(CASE WHEN au.timestamp >= $2 THEN 1 END) as current_requests,
                COUNT(CASE WHEN au.timestamp < $2 THEN 1 END) as previous_requests,
                SUM(CASE WHEN au.timestamp >= $2 THEN COALESCE(au.cost_usd, 0) ELSE 0 END) as current_cost,
                SUM(CASE WHEN au.timestamp < $2 THEN COALESCE(au.cost_usd, 0) ELSE 0 END) as previous_cost
            FROM api_usage au
            WHERE au.timestamp >= $3
        )
        SELECT 
            u.*,
            pu.current_tokens,
            pu.current_requests,
            pu.current_cost,
            CASE 
                WHEN pu.previous_tokens > 0 
                THEN ((pu.current_tokens - pu.previous_tokens) * 100.0 / pu.previous_tokens)
                ELSE 0 
            END as token_growth_percent
        FROM usage u
        CROSS JOIN period_usage pu
        WHERE u.organization_id = $1
        """
        
        result = await self.client.execute_raw(
            query, 
            organization_id, 
            start_date, 
            end_date - timedelta(days=period_days*2)
        )
        
        return result[0] if result else {}

# Factory para repositories
class RepositoryFactory:
    """Factory para criar repositories"""
    
    def __init__(self, client: OptimizedPrismaClient):
        self.client = client
    
    @property
    def organizations(self) -> OrganizationRepository:
        return OrganizationRepository(self.client)
    
    @property
    def agents(self) -> AgentRepository:
        return AgentRepository(self.client)
    
    @property
    def conversations(self) -> ConversationRepository:
        return ConversationRepository(self.client)
    
    @property
    def usage(self) -> UsageRepository:
        return UsageRepository(self.client)

# Instância global dos repositories
repos = RepositoryFactory(db)

# Funções de conveniência para compatibilidade
async def get_user_by_id(user_id: str) -> Optional[models.User]:
    """Busca usuário por ID (compatibilidade com auth.py)"""
    return await db.client.user.find_unique(
        where={"id": user_id},
        include={
            "memberships": {
                "include": {"organization": True}
            }
        }
    )

async def create_user(email: str, name: str = None) -> models.User:
    """Cria usuário com organização pessoal"""
    async with db.transaction() as tx:
        # Criar usuário
        user = await tx.user.create({
            "email": email,
            "name": name
        })
        
        # Criar organização pessoal
        org = await tx.organization.create({
            "name": f"{name or email.split('@')[0]} Personal"
        })
        
        # Criar membership
        await tx.membership.create({
            "organization_id": org.id,
            "user_id": user.id,
            "role": "OWNER"
        })
        
        return user

# Inicialização e cleanup
async def initialize_database():
    """Inicializa conexão com o banco"""
    await db.connect()
    logger.info("Database inicializado com sucesso")

async def cleanup_database():
    """Limpa conexões do banco"""
    await db.disconnect()
    logger.info("Database finalizado")

# Health check
async def database_health_check() -> Dict[str, Any]:
    """Verifica saúde do banco de dados"""
    try:
        # Teste básico de conexão
        await db.client.user.count()
        
        # Teste cache Redis
        cache_healthy = await db.cache_set("health_check", "ok", 60)
        
        # Teste connection pool
        pool_healthy = db._connection_pool is not None
        
        return {
            "status": "healthy",
            "database": True,
            "cache": cache_healthy,
            "pool": pool_healthy,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check falhou: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }