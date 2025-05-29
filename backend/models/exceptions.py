"""
=============================================================================
EXCEPTIONS - AGENTES DE CONVERSÃO
Sistema unificado de exceções com error handling robusto
=============================================================================
"""

from typing import Any, Dict, List, Optional
from datetime import datetime
from enum import Enum

from fastapi import HTTPException, status
from pydantic import BaseModel, Field

# =============================================================================
# ERROR CODES
# =============================================================================

class ErrorCode(str, Enum):
    """Códigos de erro padronizados"""
    
    # Validation Errors (1000-1999)
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_INPUT = "INVALID_INPUT"
    MISSING_FIELD = "MISSING_FIELD"
    INVALID_FORMAT = "INVALID_FORMAT"
    INVALID_EMAIL = "INVALID_EMAIL"
    INVALID_URL = "INVALID_URL"
    INVALID_UUID = "INVALID_UUID"
    INVALID_JSON = "INVALID_JSON"
    INVALID_DATE = "INVALID_DATE"
    
    # Authentication Errors (2000-2999)
    UNAUTHORIZED = "UNAUTHORIZED"
    INVALID_TOKEN = "INVALID_TOKEN"
    EXPIRED_TOKEN = "EXPIRED_TOKEN"
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS"
    ACCOUNT_DISABLED = "ACCOUNT_DISABLED"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    
    # Resource Errors (3000-3999)
    NOT_FOUND = "NOT_FOUND"
    ALREADY_EXISTS = "ALREADY_EXISTS"
    CONFLICT = "CONFLICT"
    GONE = "GONE"
    
    # Business Logic Errors (4000-4999)
    BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION"
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
    INVALID_STATE = "INVALID_STATE"
    OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED"
    
    # Database Errors (5000-5999)
    DATABASE_ERROR = "DATABASE_ERROR"
    CONNECTION_ERROR = "CONNECTION_ERROR"
    QUERY_ERROR = "QUERY_ERROR"
    TRANSACTION_ERROR = "TRANSACTION_ERROR"
    
    # External Service Errors (6000-6999)
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR"
    PAYMENT_ERROR = "PAYMENT_ERROR"
    EMAIL_SERVICE_ERROR = "EMAIL_SERVICE_ERROR"
    AI_SERVICE_ERROR = "AI_SERVICE_ERROR"
    
    # System Errors (9000-9999)
    INTERNAL_ERROR = "INTERNAL_ERROR"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
    TIMEOUT = "TIMEOUT"
    CONFIGURATION_ERROR = "CONFIGURATION_ERROR"

# =============================================================================
# ERROR DETAILS
# =============================================================================

class ErrorDetail(BaseModel):
    """Detalhes específicos do erro"""
    
    field: Optional[str] = Field(None, description="Campo relacionado ao erro")
    code: ErrorCode = Field(..., description="Código do erro")
    message: str = Field(..., description="Mensagem de erro")
    context: Optional[Dict[str, Any]] = Field(None, description="Contexto adicional")
    
    @classmethod
    def field_error(
        cls,
        field: str,
        code: ErrorCode,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> "ErrorDetail":
        """Criar erro de campo"""
        return cls(field=field, code=code, message=message, context=context)
    
    @classmethod
    def general_error(
        cls,
        code: ErrorCode,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> "ErrorDetail":
        """Criar erro geral"""
        return cls(code=code, message=message, context=context)

class ErrorResponse(BaseModel):
    """Response padronizado de erro"""
    
    success: bool = Field(default=False)
    error_code: ErrorCode = Field(..., description="Código principal do erro")
    message: str = Field(..., description="Mensagem principal")
    details: List[ErrorDetail] = Field(default_factory=list, description="Detalhes específicos")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = Field(None, description="ID da requisição")
    trace_id: Optional[str] = Field(None, description="ID do trace")
    
    def add_detail(self, detail: ErrorDetail) -> None:
        """Adicionar detalhe do erro"""
        self.details.append(detail)
    
    def add_field_error(
        self,
        field: str,
        code: ErrorCode,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> None:
        """Adicionar erro de campo"""
        self.add_detail(ErrorDetail.field_error(field, code, message, context))

# =============================================================================
# BASE EXCEPTIONS
# =============================================================================

class BaseAppException(Exception):
    """Exceção base da aplicação"""
    
    def __init__(
        self,
        message: str,
        error_code: ErrorCode,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[List[ErrorDetail]] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or []
        self.context = context or {}
        super().__init__(self.message)
    
    def to_http_exception(self) -> HTTPException:
        """Converter para HTTPException do FastAPI"""
        return HTTPException(
            status_code=self.status_code,
            detail=self.to_response().dict()
        )
    
    def to_response(self) -> ErrorResponse:
        """Converter para ErrorResponse"""
        return ErrorResponse(
            error_code=self.error_code,
            message=self.message,
            details=self.details
        )
    
    def add_detail(self, detail: ErrorDetail) -> None:
        """Adicionar detalhe"""
        self.details.append(detail)
    
    def add_context(self, key: str, value: Any) -> None:
        """Adicionar contexto"""
        self.context[key] = value

# =============================================================================
# VALIDATION EXCEPTIONS
# =============================================================================

class ValidationError(BaseAppException):
    """Erro de validação"""
    
    def __init__(
        self,
        message: str = "Validation failed",
        details: Optional[List[ErrorDetail]] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.VALIDATION_ERROR,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
            context=context
        )
    
    @classmethod
    def field_error(
        cls,
        field: str,
        message: str,
        code: ErrorCode = ErrorCode.INVALID_INPUT,
        context: Optional[Dict[str, Any]] = None
    ) -> "ValidationError":
        """Criar erro de campo específico"""
        detail = ErrorDetail.field_error(field, code, message, context)
        return cls(
            message=f"Validation failed for field: {field}",
            details=[detail],
            context=context
        )
    
    @classmethod
    def multiple_fields(
        cls,
        field_errors: List[tuple[str, str, ErrorCode]]
    ) -> "ValidationError":
        """Criar erro para múltiplos campos"""
        details = [
            ErrorDetail.field_error(field, code, message)
            for field, message, code in field_errors
        ]
        return cls(
            message="Multiple validation errors",
            details=details
        )

class InvalidEmailError(ValidationError):
    """Email inválido"""
    
    def __init__(self, email: str):
        super().__init__(
            message=f"Invalid email format: {email}",
            details=[ErrorDetail.field_error(
                "email",
                ErrorCode.INVALID_EMAIL,
                f"'{email}' is not a valid email address"
            )]
        )

class InvalidUUIDError(ValidationError):
    """UUID inválido"""
    
    def __init__(self, value: str, field: str = "id"):
        super().__init__(
            message=f"Invalid UUID format: {value}",
            details=[ErrorDetail.field_error(
                field,
                ErrorCode.INVALID_UUID,
                f"'{value}' is not a valid UUID"
            )]
        )

# =============================================================================
# AUTHENTICATION EXCEPTIONS
# =============================================================================

class AuthenticationError(BaseAppException):
    """Erro de autenticação"""
    
    def __init__(
        self,
        message: str = "Authentication failed",
        error_code: ErrorCode = ErrorCode.UNAUTHORIZED,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status.HTTP_401_UNAUTHORIZED,
            context=context
        )

class InvalidTokenError(AuthenticationError):
    """Token inválido"""
    
    def __init__(self, reason: str = "Invalid token"):
        super().__init__(
            message=reason,
            error_code=ErrorCode.INVALID_TOKEN
        )

class ExpiredTokenError(AuthenticationError):
    """Token expirado"""
    
    def __init__(self):
        super().__init__(
            message="Token has expired",
            error_code=ErrorCode.EXPIRED_TOKEN
        )

class PermissionError(BaseAppException):
    """Erro de permissão"""
    
    def __init__(
        self,
        message: str = "Insufficient permissions",
        required_permission: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.INSUFFICIENT_PERMISSIONS,
            status_code=status.HTTP_403_FORBIDDEN,
            context=context
        )
        if required_permission:
            self.add_context("required_permission", required_permission)

# =============================================================================
# RESOURCE EXCEPTIONS
# =============================================================================

class NotFoundError(BaseAppException):
    """Recurso não encontrado"""
    
    def __init__(
        self,
        resource: str,
        identifier: str,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"{resource} not found: {identifier}",
            error_code=ErrorCode.NOT_FOUND,
            status_code=status.HTTP_404_NOT_FOUND,
            context=context
        )
        self.add_context("resource", resource)
        self.add_context("identifier", identifier)

class AlreadyExistsError(BaseAppException):
    """Recurso já existe"""
    
    def __init__(
        self,
        resource: str,
        identifier: str,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"{resource} already exists: {identifier}",
            error_code=ErrorCode.ALREADY_EXISTS,
            status_code=status.HTTP_409_CONFLICT,
            context=context
        )
        self.add_context("resource", resource)
        self.add_context("identifier", identifier)

class ConflictError(BaseAppException):
    """Conflito de estado"""
    
    def __init__(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.CONFLICT,
            status_code=status.HTTP_409_CONFLICT,
            context=context
        )

# =============================================================================
# BUSINESS LOGIC EXCEPTIONS
# =============================================================================

class BusinessRuleError(BaseAppException):
    """Violação de regra de negócio"""
    
    def __init__(
        self,
        rule: str,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.BUSINESS_RULE_VIOLATION,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            context=context
        )
        self.add_context("rule", rule)

class QuotaExceededError(BusinessRuleError):
    """Cota excedida"""
    
    def __init__(
        self,
        quota_type: str,
        current: int,
        limit: int,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            rule="quota_limit",
            message=f"{quota_type} quota exceeded: {current}/{limit}",
            context=context
        )
        self.error_code = ErrorCode.QUOTA_EXCEEDED
        self.add_context("quota_type", quota_type)
        self.add_context("current", current)
        self.add_context("limit", limit)

class RateLimitError(BaseAppException):
    """Rate limit excedido"""
    
    def __init__(
        self,
        limit: int,
        window: str,
        retry_after: Optional[int] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"Rate limit exceeded: {limit} requests per {window}",
            error_code=ErrorCode.RATE_LIMIT_EXCEEDED,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            context=context
        )
        self.add_context("limit", limit)
        self.add_context("window", window)
        if retry_after:
            self.add_context("retry_after", retry_after)

# =============================================================================
# DATABASE EXCEPTIONS
# =============================================================================

class DatabaseError(BaseAppException):
    """Erro de banco de dados"""
    
    def __init__(
        self,
        message: str,
        operation: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.DATABASE_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            context=context
        )
        if operation:
            self.add_context("operation", operation)

class ConnectionError(DatabaseError):
    """Erro de conexão"""
    
    def __init__(self, service: str, context: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Failed to connect to {service}",
            operation="connect",
            context=context
        )
        self.error_code = ErrorCode.CONNECTION_ERROR
        self.add_context("service", service)

# =============================================================================
# EXTERNAL SERVICE EXCEPTIONS
# =============================================================================

class ExternalServiceError(BaseAppException):
    """Erro de serviço externo"""
    
    def __init__(
        self,
        service: str,
        message: str,
        status_code: Optional[int] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"{service} error: {message}",
            error_code=ErrorCode.EXTERNAL_SERVICE_ERROR,
            status_code=status.HTTP_502_BAD_GATEWAY,
            context=context
        )
        self.add_context("service", service)
        if status_code:
            self.add_context("external_status_code", status_code)

class AIServiceError(ExternalServiceError):
    """Erro do serviço de IA"""
    
    def __init__(
        self,
        provider: str,
        message: str,
        model: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            service=f"AI Provider ({provider})",
            message=message,
            context=context
        )
        self.error_code = ErrorCode.AI_SERVICE_ERROR
        self.add_context("provider", provider)
        if model:
            self.add_context("model", model)

class PaymentError(ExternalServiceError):
    """Erro de pagamento"""
    
    def __init__(
        self,
        provider: str,
        message: str,
        payment_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            service=f"Payment Provider ({provider})",
            message=message,
            context=context
        )
        self.error_code = ErrorCode.PAYMENT_ERROR
        self.add_context("provider", provider)
        if payment_id:
            self.add_context("payment_id", payment_id)

# =============================================================================
# SYSTEM EXCEPTIONS
# =============================================================================

class SystemError(BaseAppException):
    """Erro interno do sistema"""
    
    def __init__(
        self,
        message: str = "Internal system error",
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.INTERNAL_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            context=context
        )

class ServiceUnavailableError(BaseAppException):
    """Serviço indisponível"""
    
    def __init__(
        self,
        service: str,
        retry_after: Optional[int] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"Service unavailable: {service}",
            error_code=ErrorCode.SERVICE_UNAVAILABLE,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            context=context
        )
        self.add_context("service", service)
        if retry_after:
            self.add_context("retry_after", retry_after)

class TimeoutError(BaseAppException):
    """Timeout de operação"""
    
    def __init__(
        self,
        operation: str,
        timeout: float,
        context: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"Operation timeout: {operation} (>{timeout}s)",
            error_code=ErrorCode.TIMEOUT,
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            context=context
        )
        self.add_context("operation", operation)
        self.add_context("timeout", timeout)

# =============================================================================
# EXCEPTION UTILITIES
# =============================================================================

def create_validation_error_from_pydantic(exc) -> ValidationError:
    """Converter erro do Pydantic para ValidationError"""
    details = []
    
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        code = ErrorCode.VALIDATION_ERROR
        
        # Map specific Pydantic error types
        if error["type"] == "value_error.email":
            code = ErrorCode.INVALID_EMAIL
        elif error["type"] == "value_error.url":
            code = ErrorCode.INVALID_URL
        elif error["type"] == "value_error.uuid":
            code = ErrorCode.INVALID_UUID
        elif error["type"] == "value_error.missing":
            code = ErrorCode.MISSING_FIELD
        
        details.append(ErrorDetail.field_error(field, code, message))
    
    return ValidationError(
        message="Validation failed",
        details=details
    )