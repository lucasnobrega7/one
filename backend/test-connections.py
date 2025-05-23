#!/usr/bin/env python3
"""
Test script para verificar conexões Prisma e Redis
Teste as conexões antes do deploy
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

async def test_prisma_connection():
    """Test Prisma database connection"""
    try:
        from prisma import Prisma
        
        print("🔗 Testando conexão Prisma...")
        client = Prisma()
        await client.connect()
        
        # Test simple query
        print("✅ Prisma conectado com sucesso!")
        print(f"📊 Database URL: {os.getenv('DATABASE_URL', '').split('@')[1] if '@' in os.getenv('DATABASE_URL', '') else 'Hidden'}")
        
        await client.disconnect()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão Prisma: {e}")
        return False

async def test_redis_connection():
    """Test Redis connection"""
    try:
        import redis.asyncio as redis
        
        print("🔗 Testando conexão Redis...")
        redis_url = os.getenv('REDIS_URL')
        
        if not redis_url:
            print("❌ REDIS_URL não configurado")
            return False
            
        client = redis.from_url(redis_url)
        
        # Test ping
        await client.ping()
        print("✅ Redis conectado com sucesso!")
        print(f"📊 Redis URL: {redis_url.split('@')[1] if '@' in redis_url else 'Hidden'}")
        
        # Test set/get
        await client.set('test_key', 'test_value', ex=10)
        result = await client.get('test_key')
        
        if result == b'test_value':
            print("✅ Redis read/write funcionando!")
        
        await client.aclose()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão Redis: {e}")
        return False

async def test_api_dependencies():
    """Test if all API dependencies are available"""
    try:
        # Test imports
        from fastapi import FastAPI
        from sse_starlette.sse import EventSourceResponse
        from supabase import create_client
        
        print("✅ Todas as dependências da API estão disponíveis!")
        return True
        
    except ImportError as e:
        print(f"❌ Dependência faltando: {e}")
        return False

async def main():
    """Run all connection tests"""
    print("🧪 Iniciando testes de conexão...")
    print("=" * 50)
    
    # Test dependencies
    deps_ok = await test_api_dependencies()
    
    # Test connections
    prisma_ok = await test_prisma_connection()
    redis_ok = await test_redis_connection()
    
    print("=" * 50)
    
    if deps_ok and prisma_ok and redis_ok:
        print("🎉 Todos os testes passaram! API v2.0 pronta para deploy!")
        return True
    else:
        print("⚠️  Alguns testes falharam. Verifique as configurações.")
        return False

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Testes interrompidos pelo usuário")
        exit(1)
    except Exception as e:
        print(f"\n❌ Erro nos testes: {e}")
        exit(1)