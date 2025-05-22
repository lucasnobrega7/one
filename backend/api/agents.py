from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from ..database import get_db
from ..auth import get_current_user
from ..models import Agent, User
from ..schemas import AgentCreate, AgentUpdate, AgentResponse

router = APIRouter()

@router.get("/", response_model=List[AgentResponse])
async def list_agents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todos os agentes do usuário"""
    try:
        agents = db.query(Agent).filter(Agent.user_id == current_user.id).all()
        return agents
    except Exception as e:
        print(f"Erro ao listar agentes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/", response_model=AgentResponse)
async def create_agent(
    agent: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria um novo agente"""
    try:
        db_agent = Agent(
            id=str(uuid4()),
            user_id=current_user.id,
            name=agent.name,
            description=agent.description,
            model=agent.model,
            instructions=agent.instructions,
            knowledge_base_id=agent.knowledge_base_id,
            tools=agent.tools,
            temperature=agent.temperature,
            max_tokens=agent.max_tokens,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(db_agent)
        db.commit()
        db.refresh(db_agent)
        return db_agent
    except Exception as e:
        print(f"Erro ao criar agente: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar agente"
        )

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém detalhes de um agente específico"""
    try:
        agent = db.query(Agent).filter(
            Agent.id == agent_id,
            Agent.user_id == current_user.id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        return agent
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao buscar agente: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    agent_update: AgentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza um agente existente"""
    try:
        agent = db.query(Agent).filter(
            Agent.id == agent_id,
            Agent.user_id == current_user.id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        update_data = agent_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(agent, field, value)
        
        agent.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(agent)
        return agent
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao atualizar agente: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar agente"
        )

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove um agente"""
    try:
        agent = db.query(Agent).filter(
            Agent.id == agent_id,
            Agent.user_id == current_user.id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        db.delete(agent)
        db.commit()
        
        return {"message": "Agente removido com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao deletar agente: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar agente"
        )

@router.post("/{agent_id}/query")
async def query_agent(
    agent_id: str,
    query: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Envia uma consulta para um agente"""
    try:
        agent = db.query(Agent).filter(
            Agent.id == agent_id,
            Agent.user_id == current_user.id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        message = query.get("message")
        if not message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mensagem é obrigatória"
            )
        
        # TODO: Implementar lógica de processamento com LLM
        # Por enquanto, retorna uma resposta mockada
        
        return {
            "response": f"Resposta do agente '{agent.name}' para: {message}",
            "agent_id": agent_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao consultar agente: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar consulta"
        )