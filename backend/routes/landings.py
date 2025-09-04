from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
import logging
import asyncio
from typing import Optional

from ..models import LandingSubmission, DemoScheduling, LandingResponse, LeadRecord
from ..services.external_api import kavvi_api, google_calendar
from ..services.rate_limiter import RateLimiter
from ..utils.validators import validate_whatsapp, validate_email, sanitize_input, get_error_message
from motor.motor_asyncio import AsyncIOMotorClient
import os

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/landings", tags=["landings"])

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize rate limiter
rate_limiter = RateLimiter(db.rate_limits)

def get_client_ip(request: Request) -> str:
    """Extract client IP from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host

@router.post("/submit", response_model=LandingResponse)
async def submit_landing_form(
    submission: LandingSubmission,
    request: Request
):
    """Handle landing page form submissions"""
    try:
        client_ip = get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        
        # Check rate limits
        ip_allowed, ip_error = await rate_limiter.check_ip_rate_limit(client_ip)
        if not ip_allowed:
            await rate_limiter.record_attempt(client_ip, submission.email)
            raise HTTPException(status_code=429, detail=ip_error)
        
        email_allowed, email_error = await rate_limiter.check_email_rate_limit(submission.email)
        if not email_allowed:
            await rate_limiter.record_attempt(client_ip, submission.email)
            raise HTTPException(status_code=429, detail=email_error)
        
        # Record attempt
        await rate_limiter.record_attempt(client_ip, submission.email)
        
        # Validate inputs (additional validation beyond Pydantic)
        whatsapp_valid, normalized_whatsapp, whatsapp_error = validate_whatsapp(submission.whatsapp)
        if not whatsapp_valid:
            raise HTTPException(status_code=400, detail=whatsapp_error)
        
        # Sanitize inputs
        clean_name = sanitize_input(submission.name, 100)
        clean_company = sanitize_input(submission.company or "", 100)
        clean_notes = sanitize_input(submission.notes or "", 500)
        
        # Prepare lead data
        lead_data = {
            "name": clean_name,
            "email": submission.email,
            "whatsapp": normalized_whatsapp,
            "company": clean_company,
            "notes": clean_notes,
            "utm": submission.utm.dict() if submission.utm else {}
        }
        
        # Submit to external KAVVI API
        external_result = await kavvi_api.submit_lead(lead_data)
        external_lead_id = external_result.get("id") if external_result else None
        
        # Create local lead record
        lead_record = LeadRecord(
            name=clean_name,
            email=submission.email,
            whatsapp=normalized_whatsapp,
            company=clean_company,
            action_type=submission.action_type,
            utm_data=submission.utm.dict() if submission.utm else {},
            external_lead_id=external_lead_id
        )
        
        # Handle different action types
        response_data = {
            "success": True,
            "message": "Cadastro realizado com sucesso!"
        }
        
        if submission.action_type == "trial":
            # Start 3-day trial
            trial_expires = datetime.utcnow() + timedelta(days=3)
            lead_record.trial_expires = trial_expires
            response_data["trial_expires"] = trial_expires
            response_data["message"] = "Trial de 3 dias ativado com sucesso! Acesse sua conta em breve."
            
            # Send analytics event
            await kavvi_api.send_analytics_event({
                "event": "trial_started",
                "properties": {
                    "page": "whatsapp-lead-generation",
                    "email": submission.email,
                    "utm_source": submission.utm.utm_source if submission.utm else None,
                    "user_agent": user_agent,
                    "ip_address": client_ip
                }
            })
            
        elif submission.action_type == "demo":
            # For demo, we'll return success but actual scheduling happens in separate endpoint
            response_data["message"] = "Interesse em demo registrado! Nossa equipe entrará em contato."
            
            # Send analytics event
            await kavvi_api.send_analytics_event({
                "event": "form_submit",
                "properties": {
                    "page": "whatsapp-lead-generation",
                    "action": "demo_interest",
                    "email": submission.email,
                    "utm_source": submission.utm.utm_source if submission.utm else None,
                    "user_agent": user_agent,
                    "ip_address": client_ip
                }
            })
        
        # Save lead to database
        await db.leads.insert_one(lead_record.dict())
        
        # Send form submit analytics event
        await kavvi_api.send_analytics_event({
            "event": "form_submit",
            "properties": {
                "page": "whatsapp-lead-generation",
                "action_type": submission.action_type,
                "utm_source": submission.utm.utm_source if submission.utm else None,
                "utm_medium": submission.utm.utm_medium if submission.utm else None,
                "utm_campaign": submission.utm.utm_campaign if submission.utm else None,
                "referrer": submission.utm.referrer if submission.utm else None,
                "user_agent": user_agent,
                "ip_address": client_ip
            }
        })
        
        return LandingResponse(**response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Form submission error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=get_error_message('server_error')
        )

@router.post("/demo/schedule")
async def schedule_demo(
    demo_request: DemoScheduling,
    request: Request
):
    """Schedule a demo with Google Calendar integration"""
    try:
        client_ip = get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        
        # Validate datetime
        if demo_request.preferred_datetime <= datetime.utcnow():
            raise HTTPException(
                status_code=400,
                detail=get_error_message('future_date_required')
            )
        
        # Check if it's business hours (9 AM - 6 PM Brazil time)
        demo_hour = demo_request.preferred_datetime.hour
        if demo_hour < 9 or demo_hour >= 18:
            raise HTTPException(
                status_code=400,
                detail=get_error_message('business_hours_only')
            )
        
        # Check if it's a weekday
        if demo_request.preferred_datetime.weekday() >= 5:
            raise HTTPException(
                status_code=400,
                detail=get_error_message('weekdays_only')
            )
        
        # For now, we'll simulate calendar integration
        # In production, this would integrate with Google Calendar OAuth
        
        # Generate a mock calendar event ID
        import uuid
        calendar_event_id = f"demo_{uuid.uuid4().hex[:12]}"
        
        # Create lead record with demo scheduling
        lead_record = LeadRecord(
            name=demo_request.name,
            email=demo_request.email,
            whatsapp=demo_request.whatsapp,
            company=demo_request.company,
            action_type="demo",
            utm_data=demo_request.utm.dict() if demo_request.utm else {},
            demo_scheduled=demo_request.preferred_datetime,
            calendar_event_id=calendar_event_id
        )
        
        # Save to database
        await db.leads.insert_one(lead_record.dict())
        
        # Send analytics event
        await kavvi_api.send_analytics_event({
            "event": "demo_scheduled",
            "properties": {
                "page": "whatsapp-lead-generation",
                "demo_datetime": demo_request.preferred_datetime.isoformat(),
                "email": demo_request.email,
                "utm_source": demo_request.utm.utm_source if demo_request.utm else None,
                "user_agent": user_agent,
                "ip_address": client_ip
            }
        })
        
        return {
            "success": True,
            "message": f"Demo agendado para {demo_request.preferred_datetime.strftime('%d/%m/%Y às %H:%M')}",
            "demo_scheduled": demo_request.preferred_datetime,
            "calendar_event_id": calendar_event_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Demo scheduling error: {e}")
        raise HTTPException(
            status_code=500,
            detail=get_error_message('server_error')
        )

@router.get("/health")
async def health_check():
    """Health check for landing page services"""
    try:
        # Test database connection
        await db.command("ping")
        
        return {
            "status": "healthy",
            "services": {
                "database": "connected",
                "external_api": "configured" if kavvi_api.submit_secret else "not_configured"
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")