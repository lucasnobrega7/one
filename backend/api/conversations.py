from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from ..database import get_db
from ..auth import get_current_user
from ..models import Conversation, Message, User, Agent
from ..schemas import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse

router = APIRouter()

@router.get("/", response_model=List[ConversationResponse])
async def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todas as conversas do usuário"""
    try:
        conversations = db.query(Conversation).filter(
            Conversation.user_id == current_user.id
        ).order_by(Conversation.updated_at.desc()).all()
        return conversations
    except Exception as e:
        print(f"Erro ao listar conversas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/", response_model=ConversationResponse)
async def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria uma nova conversa"""
    try:
        # Verifica se o agente existe e pertence ao usuário
        agent = db.query(Agent).filter(
            Agent.id == conversation.agent_id,
            Agent.user_id == current_user.id
        ).first()
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agente não encontrado"
            )
        
        db_conversation = Conversation(
            id=str(uuid4()),
            user_id=current_user.id,
            agent_id=conversation.agent_id,
            title=conversation.title or f"Conversa com {agent.name}",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)
        return db_conversation
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao criar conversa: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar conversa"
        )

@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém detalhes de uma conversa específica"""
    try:
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversa não encontrada"
            )
        
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao buscar conversa: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém todas as mensagens de uma conversa"""
    try:
        # Verifica se a conversa existe e pertence ao usuário
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversa não encontrada"
            )
        
        messages = db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc()).all()
        
        return messages
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao buscar mensagens: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def add_message(
    conversation_id: str,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Adiciona uma mensagem a uma conversa"""
    try:
        # Verifica se a conversa existe e pertence ao usuário
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversa não encontrada"
            )
        
        # Cria a mensagem do usuário
        user_message = Message(
            id=str(uuid4()),
            conversation_id=conversation_id,
            role="user",
            content=message.content,
            created_at=datetime.utcnow()
        )
        db.add(user_message)
        
        # TODO: Processar com o agente e criar resposta
        # Por enquanto, cria uma resposta mockada
        agent_message = Message(
            id=str(uuid4()),
            conversation_id=conversation_id,
            role="assistant",
            content=f"Resposta do agente para: {message.content}",
            created_at=datetime.utcnow()
        )
        db.add(agent_message)
        
        # Atualiza o timestamp da conversa
        conversation.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(agent_message)
        
        return agent_message
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao adicionar mensagem: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar mensagem"
        )

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove uma conversa e todas suas mensagens"""
    try:
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversa não encontrada"
            )
        
        # Deleta todas as mensagens da conversa
        db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).delete()
        
        # Deleta a conversa
        db.delete(conversation)
        db.commit()
        
        return {"message": "Conversa removida com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao deletar conversa: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar conversa"
        )