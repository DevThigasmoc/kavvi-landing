from fastapi import APIRouter, Request, HTTPException
from datetime import datetime
import logging
from typing import Dict, Any

from ..models import AnalyticsEvent
from ..services.external_api import kavvi_api

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["analytics"])

def get_client_ip(request: Request) -> str:
    """Extract client IP from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host

@router.post("/track")
async def track_event(
    event_data: AnalyticsEvent,
    request: Request
):
    """Track analytics events"""
    try:
        client_ip = get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        
        # Enrich event data with request info
        enriched_properties = {
            **event_data.properties,
            "ip_address": client_ip,
            "user_agent": user_agent,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Send to KAVVI analytics
        analytics_payload = {
            "event": event_data.event,
            "properties": enriched_properties,
            "session_id": event_data.session_id,
            "timestamp": event_data.timestamp.isoformat()
        }
        
        # Fire and forget - don't block the response
        await kavvi_api.send_analytics_event(analytics_payload)
        
        return {
            "success": True,
            "message": "Event tracked successfully"
        }
        
    except Exception as e:
        logger.warning(f"Analytics tracking error: {e}")
        # Don't fail - analytics is not critical
        return {
            "success": False,
            "message": "Event tracking failed"
        }

@router.post("/page_view")
async def track_page_view(
    request: Request,
    properties: Dict[str, Any] = None
):
    """Track page view events"""
    try:
        client_ip = get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        referrer = request.headers.get("Referer", "")
        
        # Extract UTM parameters from referrer or properties
        event_properties = {
            "page": "whatsapp-lead-generation",
            "referrer": referrer,
            "user_agent": user_agent,
            "ip_address": client_ip,
            **(properties or {})
        }
        
        # Send page view event
        await kavvi_api.send_analytics_event({
            "event": "landing_view",
            "properties": event_properties
        })
        
        return {"success": True}
        
    except Exception as e:
        logger.warning(f"Page view tracking error: {e}")
        return {"success": False}

@router.post("/cta_click")
async def track_cta_click(
    request: Request,
    cta_data: Dict[str, Any]
):
    """Track CTA button clicks"""
    try:
        client_ip = get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        
        event_properties = {
            "page": "whatsapp-lead-generation",
            "cta_type": cta_data.get("cta_type", "unknown"),
            "cta_location": cta_data.get("cta_location", "unknown"),
            "user_agent": user_agent,
            "ip_address": client_ip,
            **cta_data.get("utm", {})
        }
        
        await kavvi_api.send_analytics_event({
            "event": "cta_click",
            "properties": event_properties
        })
        
        return {"success": True}
        
    except Exception as e:
        logger.warning(f"CTA click tracking error: {e}")
        return {"success": False}