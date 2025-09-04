import aiohttp
import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class KAVVIAPIService:
    def __init__(self):
        self.base_url = "https://api.kavvicrm.com.br"
        self.submit_secret = os.environ.get('LANDINGS_SUBMIT_SECRET')
        self.events_ingest_url = os.environ.get('EVENTS_INGEST_URL', f"{self.base_url}/events/ingest")
    
    async def submit_lead(self, lead_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Submit lead to KAVVI API"""
        try:
            headers = {
                'Authorization': f'Bearer {self.submit_secret}',
                'Content-Type': 'application/json'
            }
            
            # Format data according to KAVVI API spec
            payload = {
                "name": lead_data.get("name"),
                "email": lead_data.get("email"),
                "whatsapp": lead_data.get("whatsapp"),
                "company": lead_data.get("company", ""),
                "notes": lead_data.get("notes", ""),
                "source": "landing-whatsapp",
                "utm": lead_data.get("utm", {})
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/landings/submit",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        logger.info(f"Lead submitted successfully: {result}")
                        return result
                    else:
                        error_text = await response.text()
                        logger.error(f"KAVVI API error {response.status}: {error_text}")
                        return None
                        
        except aiohttp.ClientError as e:
            logger.error(f"Network error submitting lead: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error submitting lead: {e}")
            return None
    
    async def send_analytics_event(self, event_data: Dict[str, Any]) -> bool:
        """Send analytics event to KAVVI"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'X-Tenant': 'kavvi-site'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.events_ingest_url,
                    json=event_data,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=5)
                ) as response:
                    if response.status in [200, 201, 202]:
                        logger.info(f"Analytics event sent: {event_data.get('event')}")
                        return True
                    else:
                        logger.warning(f"Analytics event failed {response.status}")
                        return False
                        
        except Exception as e:
            logger.warning(f"Analytics event error: {e}")
            return False  # Don't fail the main request for analytics

class GoogleCalendarService:
    def __init__(self):
        self.client_id = os.environ.get('GOOGLE_CLIENT_ID')
        self.client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
        self.redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI')
    
    def get_oauth_url(self, state: str) -> str:
        """Generate Google OAuth URL for calendar access"""
        scopes = "https://www.googleapis.com/auth/calendar.events"
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        
        params = {
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': scopes,
            'response_type': 'code',
            'access_type': 'offline',
            'state': state
        }
        
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    async def exchange_code_for_token(self, code: str) -> Optional[Dict[str, Any]]:
        """Exchange authorization code for access token"""
        try:
            token_url = "https://oauth2.googleapis.com/token"
            data = {
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': self.redirect_uri
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(token_url, data=data) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Token exchange failed: {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Token exchange error: {e}")
            return None
    
    async def create_calendar_event(self, access_token: str, event_details: Dict[str, Any]) -> Optional[str]:
        """Create calendar event and return event ID"""
        try:
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Calculate end time (30 minutes after start)
            start_time = event_details['start_time']
            end_time = start_time + timedelta(minutes=30)
            
            event_payload = {
                'summary': f"Demo KAVVI CRM - {event_details['lead_name']}",
                'description': f"""
Demo KAVVI CRM

Cliente: {event_details['lead_name']}
Empresa: {event_details.get('company', 'N/A')}
Telefone: {event_details['whatsapp']}
Email: {event_details['email']}

Link do ticket: {event_details.get('ticket_link', 'A ser criado')}
                """.strip(),
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'America/Sao_Paulo'
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'America/Sao_Paulo'
                },
                'attendees': [
                    {'email': event_details['email']},
                    {'email': event_details.get('sales_rep_email', 'vendas@kavvicrm.com.br')}
                ],
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 60},
                        {'method': 'popup', 'minutes': 15}
                    ]
                }
            }
            
            calendar_url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    calendar_url,
                    json=event_payload,
                    headers=headers
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        event_id = result.get('id')
                        logger.info(f"Calendar event created: {event_id}")
                        return event_id
                    else:
                        error_text = await response.text()
                        logger.error(f"Calendar event creation failed: {error_text}")
                        return None
                        
        except Exception as e:
            logger.error(f"Calendar event creation error: {e}")
            return None

# Initialize services
kavvi_api = KAVVIAPIService()
google_calendar = GoogleCalendarService()