from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import datetime
import re
import uuid

class UTMData(BaseModel):
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None
    gclid: Optional[str] = None
    gbraid: Optional[str] = None
    wbraid: Optional[str] = None
    fbclid: Optional[str] = None
    msclkid: Optional[str] = None
    referrer: Optional[str] = None
    device: Optional[str] = None
    placement: Optional[str] = None
    dkinsertion: Optional[str] = None

class LandingSubmission(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    whatsapp: str = Field(..., min_length=10, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=500)
    action_type: str = Field(..., regex="^(trial|demo)$")
    utm: Optional[UTMData] = UTMData()
    # Honeypot field
    website: Optional[str] = Field(None, max_length=0)  # Should be empty
    
    @validator('whatsapp')
    def normalize_whatsapp(cls, v):
        if not v:
            raise ValueError('WhatsApp é obrigatório')
        
        # Remove formatting
        cleaned = re.sub(r'[^\d+]', '', v)
        
        # Add +55 if no country code
        if not cleaned.startswith('+'):
            if cleaned.startswith('55'):
                cleaned = '+' + cleaned
            else:
                cleaned = '+55' + cleaned
        
        # Validate E.164 format for Brazil
        if not re.match(r'^\+55[1-9][0-9]{8,9}$', cleaned):
            raise ValueError('WhatsApp inválido. Use o formato: 11999999999')
        
        return cleaned
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip()
    
    @validator('website')
    def check_honeypot(cls, v):
        if v:  # If honeypot field is filled, it's likely spam
            raise ValueError('Spam detected')
        return v

class DemoScheduling(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    whatsapp: str
    company: Optional[str] = Field(None, max_length=100)
    preferred_datetime: datetime
    timezone: str = Field(default="America/Sao_Paulo")
    utm: Optional[UTMData] = UTMData()
    
    @validator('whatsapp')
    def normalize_whatsapp(cls, v):
        # Same validation as LandingSubmission
        cleaned = re.sub(r'[^\d+]', '', v)
        if not cleaned.startswith('+'):
            if cleaned.startswith('55'):
                cleaned = '+' + cleaned
            else:
                cleaned = '+55' + cleaned
        
        if not re.match(r'^\+55[1-9][0-9]{8,9}$', cleaned):
            raise ValueError('WhatsApp inválido')
        
        return cleaned

class AnalyticsEvent(BaseModel):
    event: str = Field(..., regex="^(landing_view|cta_click|form_submit|trial_started|demo_scheduled)$")
    properties: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

class LandingResponse(BaseModel):
    success: bool
    message: str
    trial_expires: Optional[datetime] = None
    demo_scheduled: Optional[datetime] = None
    calendar_event_id: Optional[str] = None

# Database models for tracking
class LeadRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    whatsapp: str
    company: Optional[str] = None
    source: str = "landing-whatsapp"
    action_type: str  # trial or demo
    utm_data: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    trial_expires: Optional[datetime] = None
    demo_scheduled: Optional[datetime] = None
    calendar_event_id: Optional[str] = None
    external_lead_id: Optional[str] = None  # ID from KAVVI API
    status: str = "active"

class RateLimitRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ip_address: str
    email: Optional[str] = None
    attempts: int = 1
    window_start: datetime = Field(default_factory=datetime.utcnow)
    blocked_until: Optional[datetime] = None