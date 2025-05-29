"""
=============================================================================
VALIDATORS - AGENTES DE CONVERSÃO
Validadores customizados robustos para business logic
=============================================================================
"""

import re
import json
import uuid
from typing import Any, Dict, List, Optional, Union, Callable
from datetime import datetime, date
from urllib.parse import urlparse
from email_validator import validate_email as email_validate, EmailNotValidError

from pydantic import validator, root_validator
from .exceptions import ValidationError, ErrorCode, ErrorDetail

# =============================================================================
# BASIC VALIDATORS
# =============================================================================

def validate_email(email: str) -> str:
    """Validar email com verificação robusta"""
    if not email:
        raise ValidationError.field_error("email", "Email is required", ErrorCode.MISSING_FIELD)
    
    try:
        # Usar email-validator library
        valid = email_validate(email.strip().lower())
        return valid.email
    except EmailNotValidError as e:
        raise ValidationError.field_error("email", str(e), ErrorCode.INVALID_EMAIL)

def validate_uuid(value: str, field_name: str = "id") -> str:
    """Validar UUID"""
    if not value:
        raise ValidationError.field_error(field_name, "UUID is required", ErrorCode.MISSING_FIELD)
    
    try:
        uuid_obj = uuid.UUID(value)
        return str(uuid_obj)
    except ValueError:
        raise ValidationError.field_error(
            field_name, 
            f"'{value}' is not a valid UUID", 
            ErrorCode.INVALID_UUID
        )

def validate_url(url: str, schemes: List[str] = None) -> str:
    """Validar URL"""
    if not url:
        raise ValidationError.field_error("url", "URL is required", ErrorCode.MISSING_FIELD)
    
    schemes = schemes or ['http', 'https']
    
    try:
        parsed = urlparse(url.strip())
        
        if not parsed.scheme:
            raise ValidationError.field_error(
                "url", 
                "URL must include scheme (http/https)", 
                ErrorCode.INVALID_URL
            )
        
        if parsed.scheme not in schemes:
            raise ValidationError.field_error(
                "url", 
                f"URL scheme must be one of: {schemes}", 
                ErrorCode.INVALID_URL
            )
        
        if not parsed.netloc:
            raise ValidationError.field_error(
                "url", 
                "URL must include domain", 
                ErrorCode.INVALID_URL
            )
        
        return url.strip()
    
    except Exception as e:
        raise ValidationError.field_error("url", f"Invalid URL: {e}", ErrorCode.INVALID_URL)

def validate_json(value: Union[str, Dict, List], field_name: str = "json") -> Dict[str, Any]:
    """Validar JSON"""
    if value is None:
        return {}
    
    if isinstance(value, (dict, list)):
        return value
    
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError as e:
            raise ValidationError.field_error(
                field_name, 
                f"Invalid JSON: {e}", 
                ErrorCode.INVALID_JSON
            )
    
    raise ValidationError.field_error(
        field_name, 
        "Value must be JSON string, dict, or list", 
        ErrorCode.INVALID_FORMAT
    )

# =============================================================================
# STRING VALIDATORS
# =============================================================================

def validate_name(name: str, min_length: int = 2, max_length: int = 100) -> str:
    """Validar nome"""
    if not name or not name.strip():
        raise ValidationError.field_error("name", "Name is required", ErrorCode.MISSING_FIELD)
    
    name = name.strip()
    
    if len(name) < min_length:
        raise ValidationError.field_error(
            "name", 
            f"Name must be at least {min_length} characters", 
            ErrorCode.INVALID_INPUT
        )
    
    if len(name) > max_length:
        raise ValidationError.field_error(
            "name", 
            f"Name must not exceed {max_length} characters", 
            ErrorCode.INVALID_INPUT
        )
    
    # Verificar caracteres válidos (letras, números, espaços, hífens)
    if not re.match(r'^[a-zA-ZÀ-ÿ0-9\s\-_.]+$', name):
        raise ValidationError.field_error(
            "name", 
            "Name contains invalid characters", 
            ErrorCode.INVALID_FORMAT
        )
    
    return name

def validate_slug(slug: str, max_length: int = 50) -> str:
    """Validar slug (URL-friendly)"""
    if not slug or not slug.strip():
        raise ValidationError.field_error("slug", "Slug is required", ErrorCode.MISSING_FIELD)
    
    slug = slug.strip().lower()
    
    # Verificar formato de slug
    if not re.match(r'^[a-z0-9\-]+$', slug):
        raise ValidationError.field_error(
            "slug", 
            "Slug can only contain lowercase letters, numbers, and hyphens", 
            ErrorCode.INVALID_FORMAT
        )
    
    if len(slug) > max_length:
        raise ValidationError.field_error(
            "slug", 
            f"Slug must not exceed {max_length} characters", 
            ErrorCode.INVALID_INPUT
        )
    
    # Não pode começar ou terminar com hífen
    if slug.startswith('-') or slug.endswith('-'):
        raise ValidationError.field_error(
            "slug", 
            "Slug cannot start or end with hyphen", 
            ErrorCode.INVALID_FORMAT
        )
    
    # Não pode ter hífens consecutivos
    if '--' in slug:
        raise ValidationError.field_error(
            "slug", 
            "Slug cannot contain consecutive hyphens", 
            ErrorCode.INVALID_FORMAT
        )
    
    return slug

def validate_password(password: str) -> str:
    """Validar senha forte"""
    if not password:
        raise ValidationError.field_error("password", "Password is required", ErrorCode.MISSING_FIELD)
    
    min_length = 8
    if len(password) < min_length:
        raise ValidationError.field_error(
            "password", 
            f"Password must be at least {min_length} characters", 
            ErrorCode.INVALID_INPUT
        )
    
    # Verificar complexidade
    has_upper = re.search(r'[A-Z]', password)
    has_lower = re.search(r'[a-z]', password)
    has_digit = re.search(r'\d', password)
    has_special = re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
    
    missing = []
    if not has_upper:
        missing.append("uppercase letter")
    if not has_lower:
        missing.append("lowercase letter")
    if not has_digit:
        missing.append("number")
    if not has_special:
        missing.append("special character")
    
    if missing:
        raise ValidationError.field_error(
            "password", 
            f"Password must contain: {', '.join(missing)}", 
            ErrorCode.INVALID_INPUT
        )
    
    return password

# =============================================================================
# NUMERIC VALIDATORS
# =============================================================================

def validate_temperature(temp: float) -> float:
    """Validar temperatura do modelo AI"""
    if temp < 0.0 or temp > 2.0:
        raise ValidationError.field_error(
            "temperature", 
            "Temperature must be between 0.0 and 2.0", 
            ErrorCode.INVALID_INPUT
        )
    return temp

def validate_max_tokens(tokens: int) -> int:
    """Validar max tokens"""
    if tokens < 1:
        raise ValidationError.field_error(
            "max_tokens", 
            "Max tokens must be at least 1", 
            ErrorCode.INVALID_INPUT
        )
    
    if tokens > 100000:  # Limite razoável
        raise ValidationError.field_error(
            "max_tokens", 
            "Max tokens cannot exceed 100,000", 
            ErrorCode.INVALID_INPUT
        )
    
    return tokens

def validate_rating(rating: int, min_val: int = 1, max_val: int = 5) -> int:
    """Validar rating/avaliação"""
    if rating < min_val or rating > max_val:
        raise ValidationError.field_error(
            "rating", 
            f"Rating must be between {min_val} and {max_val}", 
            ErrorCode.INVALID_INPUT
        )
    return rating

# =============================================================================
# DATE/TIME VALIDATORS
# =============================================================================

def validate_future_date(dt: datetime, field_name: str = "date") -> datetime:
    """Validar data futura"""
    if dt <= datetime.utcnow():
        raise ValidationError.field_error(
            field_name, 
            "Date must be in the future", 
            ErrorCode.INVALID_DATE
        )
    return dt

def validate_past_date(dt: datetime, field_name: str = "date") -> datetime:
    """Validar data passada"""
    if dt >= datetime.utcnow():
        raise ValidationError.field_error(
            field_name, 
            "Date must be in the past", 
            ErrorCode.INVALID_DATE
        )
    return dt

def validate_date_range(
    start_date: datetime, 
    end_date: datetime,
    max_days: Optional[int] = None
) -> tuple[datetime, datetime]:
    """Validar range de datas"""
    if start_date >= end_date:
        raise ValidationError.field_error(
            "end_date", 
            "End date must be after start date", 
            ErrorCode.INVALID_DATE
        )
    
    if max_days:
        diff = (end_date - start_date).days
        if diff > max_days:
            raise ValidationError.field_error(
                "end_date", 
                f"Date range cannot exceed {max_days} days", 
                ErrorCode.INVALID_INPUT
            )
    
    return start_date, end_date

# =============================================================================
# BUSINESS LOGIC VALIDATORS
# =============================================================================

def validate_model_name(model: str, allowed_models: List[str]) -> str:
    """Validar nome do modelo AI"""
    if not model:
        raise ValidationError.field_error("model", "Model name is required", ErrorCode.MISSING_FIELD)
    
    if model not in allowed_models:
        raise ValidationError.field_error(
            "model", 
            f"Model must be one of: {', '.join(allowed_models)}", 
            ErrorCode.INVALID_INPUT
        )
    
    return model

def validate_agent_prompt(prompt: str, max_length: int = 10000) -> str:
    """Validar prompt do agente"""
    if not prompt or not prompt.strip():
        raise ValidationError.field_error("prompt", "Prompt is required", ErrorCode.MISSING_FIELD)
    
    prompt = prompt.strip()
    
    if len(prompt) > max_length:
        raise ValidationError.field_error(
            "prompt", 
            f"Prompt must not exceed {max_length} characters", 
            ErrorCode.INVALID_INPUT
        )
    
    # Verificar conteúdo mínimo
    if len(prompt) < 10:
        raise ValidationError.field_error(
            "prompt", 
            "Prompt must be at least 10 characters", 
            ErrorCode.INVALID_INPUT
        )
    
    return prompt

def validate_organization_domain(domain: str) -> str:
    """Validar domínio da organização"""
    if not domain:
        return domain
    
    domain = domain.strip().lower()
    
    # Remover protocolo se presente
    if domain.startswith(('http://', 'https://')):
        domain = domain.split('://', 1)[1]
    
    # Remover trailing slash
    domain = domain.rstrip('/')
    
    # Validar formato de domínio
    domain_pattern = r'^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$'
    if not re.match(domain_pattern, domain):
        raise ValidationError.field_error(
            "domain", 
            "Invalid domain format", 
            ErrorCode.INVALID_FORMAT
        )
    
    return domain

def validate_api_key_name(name: str) -> str:
    """Validar nome da API key"""
    if not name or not name.strip():
        raise ValidationError.field_error("name", "API key name is required", ErrorCode.MISSING_FIELD)
    
    name = name.strip()
    
    if len(name) < 3:
        raise ValidationError.field_error(
            "name", 
            "API key name must be at least 3 characters", 
            ErrorCode.INVALID_INPUT
        )
    
    if len(name) > 50:
        raise ValidationError.field_error(
            "name", 
            "API key name must not exceed 50 characters", 
            ErrorCode.INVALID_INPUT
        )
    
    # Permitir apenas caracteres alfanuméricos, espaços e hífens
    if not re.match(r'^[a-zA-Z0-9\s\-_]+$', name):
        raise ValidationError.field_error(
            "name", 
            "API key name can only contain letters, numbers, spaces, hyphens, and underscores", 
            ErrorCode.INVALID_FORMAT
        )
    
    return name

# =============================================================================
# ARRAY/LIST VALIDATORS
# =============================================================================

def validate_tags(tags: List[str], max_tags: int = 10, max_length: int = 30) -> List[str]:
    """Validar tags"""
    if not tags:
        return []
    
    if len(tags) > max_tags:
        raise ValidationError.field_error(
            "tags", 
            f"Maximum {max_tags} tags allowed", 
            ErrorCode.INVALID_INPUT
        )
    
    validated_tags = []
    for i, tag in enumerate(tags):
        if not tag or not tag.strip():
            continue
        
        tag = tag.strip().lower()
        
        if len(tag) > max_length:
            raise ValidationError.field_error(
                f"tags.{i}", 
                f"Tag must not exceed {max_length} characters", 
                ErrorCode.INVALID_INPUT
            )
        
        if not re.match(r'^[a-z0-9\-_]+$', tag):
            raise ValidationError.field_error(
                f"tags.{i}", 
                "Tag can only contain lowercase letters, numbers, hyphens, and underscores", 
                ErrorCode.INVALID_FORMAT
            )
        
        if tag not in validated_tags:  # Remove duplicatas
            validated_tags.append(tag)
    
    return validated_tags

def validate_permissions(permissions: List[str], valid_permissions: List[str]) -> List[str]:
    """Validar permissões"""
    if not permissions:
        return []
    
    invalid = [p for p in permissions if p not in valid_permissions]
    if invalid:
        raise ValidationError.field_error(
            "permissions", 
            f"Invalid permissions: {', '.join(invalid)}", 
            ErrorCode.INVALID_INPUT
        )
    
    return list(set(permissions))  # Remove duplicatas

# =============================================================================
# CONDITIONAL VALIDATORS
# =============================================================================

def create_conditional_validator(
    field: str, 
    condition_field: str, 
    condition_value: Any, 
    validator_func: Callable
):
    """Factory para validadores condicionais"""
    
    def conditional_validator(cls, v, values):
        if values.get(condition_field) == condition_value:
            return validator_func(v)
        return v
    
    return validator(field, pre=True, allow_reuse=True)(conditional_validator)

# =============================================================================
# PYDANTIC VALIDATORS DECORATORS
# =============================================================================

def email_validator(field: str):
    """Decorator para validação de email"""
    return validator(field, pre=True, allow_reuse=True)(lambda cls, v: validate_email(v) if v else v)

def uuid_validator(field: str):
    """Decorator para validação de UUID"""
    return validator(field, pre=True, allow_reuse=True)(lambda cls, v: validate_uuid(v, field) if v else v)

def url_validator(field: str, schemes: List[str] = None):
    """Decorator para validação de URL"""
    def _validator(cls, v):
        return validate_url(v, schemes) if v else v
    return validator(field, pre=True, allow_reuse=True)(_validator)

def name_validator(field: str, min_length: int = 2, max_length: int = 100):
    """Decorator para validação de nome"""
    def _validator(cls, v):
        return validate_name(v, min_length, max_length) if v else v
    return validator(field, pre=True, allow_reuse=True)(_validator)

def json_validator(field: str):
    """Decorator para validação de JSON"""
    return validator(field, pre=True, allow_reuse=True)(lambda cls, v: validate_json(v, field) if v else {})

# =============================================================================
# COMPOSITE VALIDATORS
# =============================================================================

class CompositeValidator:
    """Validador composto para múltiplas validações"""
    
    def __init__(self, *validators):
        self.validators = validators
    
    def __call__(self, value):
        for validator_func in self.validators:
            value = validator_func(value)
        return value

def create_string_validator(
    min_length: Optional[int] = None,
    max_length: Optional[int] = None,
    pattern: Optional[str] = None,
    allowed_values: Optional[List[str]] = None
) -> Callable:
    """Factory para validadores de string"""
    
    def string_validator(value: str) -> str:
        if not value:
            return value
        
        value = value.strip()
        
        if min_length and len(value) < min_length:
            raise ValidationError.field_error(
                "value", 
                f"Must be at least {min_length} characters", 
                ErrorCode.INVALID_INPUT
            )
        
        if max_length and len(value) > max_length:
            raise ValidationError.field_error(
                "value", 
                f"Must not exceed {max_length} characters", 
                ErrorCode.INVALID_INPUT
            )
        
        if pattern and not re.match(pattern, value):
            raise ValidationError.field_error(
                "value", 
                "Invalid format", 
                ErrorCode.INVALID_FORMAT
            )
        
        if allowed_values and value not in allowed_values:
            raise ValidationError.field_error(
                "value", 
                f"Must be one of: {', '.join(allowed_values)}", 
                ErrorCode.INVALID_INPUT
            )
        
        return value
    
    return string_validator