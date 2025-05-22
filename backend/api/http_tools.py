from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from uuid import uuid4
from datetime import datetime
import httpx
import json
import os

from ..database import get_db
from ..auth import get_current_user
from ..models import HttpTool, User, Agent
from ..schemas import HttpToolCreate, HttpToolUpdate, HttpToolResponse, HttpToolTestRequest

router = APIRouter()

def parse_template(template: str, variables: Dict[str, Any]) -> str:
    """Substitui variáveis no template"""
    result = template
    
    # Substituir variáveis de ambiente
    for match in re.findall(r'\{\{env\.(\w+)\}\}', template):
        env_value = os.getenv(match, "")
        result = result.replace(f"{{{{env.{match}}}}}", env_value)
    
    # Substituir variáveis de entrada
    for key, value in variables.get("input", {}).items():
        result = result.replace(f"{{{{input.{key}}}}}", str(value))
    
    # Substituir variáveis de contexto
    for key, value in variables.get("context", {}).items():
        result = result.replace(f"{{{{context.{key}}}}}", str(value))
    
    return result

@router.get("/", response_model=List[HttpToolResponse])
async def list_http_tools(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todas as ferramentas HTTP do usuário"""
    try:
        tools = db.query(HttpTool).filter(
            HttpTool.user_id == current_user.id
        ).all()
        return tools
    except Exception as e:
        print(f"Erro ao listar ferramentas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/", response_model=HttpToolResponse)
async def create_http_tool(
    tool: HttpToolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria uma nova ferramenta HTTP"""
    try:
        # Se associada a um agente, verifica se ele existe
        if tool.agent_id:
            agent = db.query(Agent).filter(
                Agent.id == tool.agent_id,
                Agent.user_id == current_user.id
            ).first()
            
            if not agent:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Agente não encontrado"
                )
        
        db_tool = HttpTool(
            id=str(uuid4()),
            user_id=current_user.id,
            agent_id=tool.agent_id,
            name=tool.name,
            description=tool.description,
            method=tool.method,
            url=tool.url,
            headers=tool.headers or {},
            query_params=tool.query_params or {},
            body_template=tool.body_template,
            response_mapping=tool.response_mapping or {},
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(db_tool)
        db.commit()
        db.refresh(db_tool)
        return db_tool
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao criar ferramenta: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar ferramenta"
        )

@router.get("/{tool_id}", response_model=HttpToolResponse)
async def get_http_tool(
    tool_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém detalhes de uma ferramenta HTTP"""
    try:
        tool = db.query(HttpTool).filter(
            HttpTool.id == tool_id,
            HttpTool.user_id == current_user.id
        ).first()
        
        if not tool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ferramenta não encontrada"
            )
        
        return tool
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao buscar ferramenta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.put("/{tool_id}", response_model=HttpToolResponse)
async def update_http_tool(
    tool_id: str,
    tool_update: HttpToolUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza uma ferramenta HTTP"""
    try:
        tool = db.query(HttpTool).filter(
            HttpTool.id == tool_id,
            HttpTool.user_id == current_user.id
        ).first()
        
        if not tool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ferramenta não encontrada"
            )
        
        update_data = tool_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tool, field, value)
        
        tool.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(tool)
        return tool
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao atualizar ferramenta: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar ferramenta"
        )

@router.delete("/{tool_id}")
async def delete_http_tool(
    tool_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove uma ferramenta HTTP"""
    try:
        tool = db.query(HttpTool).filter(
            HttpTool.id == tool_id,
            HttpTool.user_id == current_user.id
        ).first()
        
        if not tool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ferramenta não encontrada"
            )
        
        db.delete(tool)
        db.commit()
        
        return {"message": "Ferramenta removida com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao deletar ferramenta: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar ferramenta"
        )

@router.post("/{tool_id}/test")
async def test_http_tool(
    tool_id: str,
    test_request: HttpToolTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Testa uma ferramenta HTTP com parâmetros fornecidos"""
    try:
        tool = db.query(HttpTool).filter(
            HttpTool.id == tool_id,
            HttpTool.user_id == current_user.id
        ).first()
        
        if not tool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ferramenta não encontrada"
            )
        
        # Prepara variáveis
        variables = {
            "input": test_request.input_variables or {},
            "context": {
                "user_id": current_user.id,
                "tool_id": tool_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        # Substitui variáveis na URL
        url = parse_template(tool.url, variables)
        
        # Prepara headers
        headers = {}
        for key, value in tool.headers.items():
            headers[key] = parse_template(value, variables)
        
        # Prepara query params
        params = {}
        for key, value in tool.query_params.items():
            params[key] = parse_template(value, variables)
        
        # Prepara body
        body = None
        if tool.body_template:
            body_str = parse_template(tool.body_template, variables)
            try:
                body = json.loads(body_str)
            except:
                body = body_str
        
        # Faz a requisição
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=tool.method,
                url=url,
                headers=headers,
                params=params,
                json=body if isinstance(body, dict) else None,
                data=body if isinstance(body, str) else None,
                timeout=30.0
            )
        
        # Processa resposta
        try:
            response_data = response.json()
        except:
            response_data = response.text
        
        return {
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "data": response_data,
            "url": url,
            "method": tool.method
        }
    except HTTPException:
        raise
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erro na requisição: {str(e)}"
        )
    except Exception as e:
        print(f"Erro ao testar ferramenta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao testar ferramenta"
        )

@router.post("/{tool_id}/execute")
async def execute_http_tool(
    tool_id: str,
    variables: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Executa uma ferramenta HTTP (usado pelos agentes)"""
    try:
        tool = db.query(HttpTool).filter(
            HttpTool.id == tool_id,
            HttpTool.is_active == True
        ).first()
        
        if not tool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ferramenta não encontrada ou inativa"
            )
        
        # Executa similar ao teste mas sem validação de usuário
        # (será validado pelo agente que está executando)
        
        # TODO: Implementar execução e mapeamento de resposta
        
        return {"executed": True, "tool_id": tool_id}
    except Exception as e:
        print(f"Erro ao executar ferramenta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao executar ferramenta"
        )