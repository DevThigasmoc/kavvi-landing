import re
from typing import Dict, Any, Tuple, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def validate_whatsapp(whatsapp: str) -> Tuple[bool, str, Optional[str]]:
    """
    Validate and normalize WhatsApp number to E.164 format
    Returns: (is_valid, normalized_number, error_message)
    """
    if not whatsapp:
        return False, "", "WhatsApp é obrigatório"
    
    # Remove all non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', whatsapp)
    
    # Add +55 if no country code
    if not cleaned.startswith('+'):
        if cleaned.startswith('55'):
            cleaned = '+' + cleaned
        else:
            cleaned = '+55' + cleaned
    
    # Validate E.164 format for Brazil
    # +55 + area code (2 digits) + number (8-9 digits)
    if not re.match(r'^\+55[1-9][0-9]{8,9}$', cleaned):
        return False, cleaned, "WhatsApp inválido. Use o formato: 11999999999"
    
    return True, cleaned, None

def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """Validate email format"""
    if not email:
        return False, "Email é obrigatório"
    
    # Basic email regex
    email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    
    if not re.match(email_pattern, email):
        return False, "Email inválido"
    
    return True, None

def sanitize_input(text: str, max_length: int = 500) -> str:
    """Sanitize text input"""
    if not text:
        return ""
    
    # Remove HTML tags and limit length
    cleaned = re.sub(r'<[^>]+>', '', str(text))
    cleaned = cleaned.strip()[:max_length]
    
    return cleaned

def extract_utm_from_request(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract UTM parameters from request"""
    utm_fields = [
        'utm_source', 'utm_medium', 'utm_campaign', 
        'utm_term', 'utm_content', 'gclid', 'gbraid', 
        'wbraid', 'fbclid', 'msclkid', 'referrer',
        'device', 'placement', 'dkinsertion'
    ]
    
    utm_data = {}
    for field in utm_fields:
        value = request_data.get(field)
        if value:
            utm_data[field] = sanitize_input(str(value), 255)
    
    return utm_data

def validate_demo_datetime(demo_datetime: datetime) -> Tuple[bool, Optional[str]]:
    """Validate demo scheduling datetime"""
    now = datetime.utcnow()
    
    # Must be in the future
    if demo_datetime <= now:
        return False, "Data/hora deve ser no futuro"
    
    # Must be within next 30 days
    max_date = now.replace(hour=23, minute=59, second=59) + timedelta(days=30)
    if demo_datetime > max_date:
        return False, "Data deve ser dentro dos próximos 30 dias"
    
    # Must be during business hours (9 AM - 6 PM Brazil time)
    # Convert to Brazil time for validation
    brazil_hour = demo_datetime.hour  # Simplified - should use proper timezone conversion
    if brazil_hour < 9 or brazil_hour >= 18:
        return False, "Horário deve ser das 9h às 18h (horário de Brasília)"
    
    # No weekends (Saturday = 5, Sunday = 6)
    if demo_datetime.weekday() >= 5:
        return False, "Demos apenas em dias úteis (segunda a sexta)"
    
    return True, None

ERROR_MESSAGES = {
    'required_field': "Este campo é obrigatório",
    'invalid_email': "Por favor, insira um email válido",
    'invalid_whatsapp': "Por favor, insira um WhatsApp válido (ex: 11999999999)",
    'rate_limit': "Muitas tentativas. Tente novamente em alguns minutos",
    'server_error': "Erro interno. Tente novamente em alguns instantes",
    'network_error': "Erro de conexão. Verifique sua internet",
    'demo_conflict': "Horário não disponível. Escolha outro horário",
    'trial_exists': "Você já possui um trial ativo",
    'honeypot_detected': "Solicitação inválida detectada",
    'invalid_datetime': "Data/hora inválida",
    'business_hours_only': "Demos disponíveis apenas em horário comercial",
    'future_date_required': "Selecione uma data futura",
    'weekdays_only': "Demos apenas em dias úteis"
}

def get_error_message(error_key: str, default: str = None) -> str:
    """Get localized error message"""
    return ERROR_MESSAGES.get(error_key, default or "Erro desconhecido")