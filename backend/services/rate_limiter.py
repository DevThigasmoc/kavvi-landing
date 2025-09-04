from datetime import datetime, timedelta
from typing import Optional, Tuple
import logging
from motor.motor_asyncio import AsyncIOMotorCollection
from ..models import RateLimitRecord

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, db_collection: AsyncIOMotorCollection):
        self.collection = db_collection
        self.ip_window_hours = 1  # 1 hour window
        self.ip_max_attempts = 5  # 5 attempts per hour per IP
        self.email_window_hours = 24  # 24 hour window
        self.email_max_attempts = 3  # 3 attempts per day per email
    
    async def check_ip_rate_limit(self, ip_address: str) -> Tuple[bool, Optional[str]]:
        """Check if IP address is rate limited"""
        try:
            now = datetime.utcnow()
            window_start = now - timedelta(hours=self.ip_window_hours)
            
            # Count attempts in current window
            count = await self.collection.count_documents({
                "ip_address": ip_address,
                "window_start": {"$gte": window_start}
            })
            
            if count >= self.ip_max_attempts:
                return False, f"Muitas tentativas deste IP. Tente novamente em {self.ip_window_hours} hora(s)"
            
            return True, None
            
        except Exception as e:
            logger.error(f"Rate limit check error: {e}")
            return True, None  # Allow on error
    
    async def check_email_rate_limit(self, email: str) -> Tuple[bool, Optional[str]]:
        """Check if email is rate limited"""
        try:
            now = datetime.utcnow()
            window_start = now - timedelta(hours=self.email_window_hours)
            
            # Count attempts for this email in current window
            count = await self.collection.count_documents({
                "email": email,
                "window_start": {"$gte": window_start}
            })
            
            if count >= self.email_max_attempts:
                return False, f"Muitas tentativas com este email. Tente novamente em {self.email_window_hours} horas"
            
            return True, None
            
        except Exception as e:
            logger.error(f"Email rate limit check error: {e}")
            return True, None  # Allow on error
    
    async def record_attempt(self, ip_address: str, email: Optional[str] = None):
        """Record a rate limit attempt"""
        try:
            record = RateLimitRecord(
                ip_address=ip_address,
                email=email,
                window_start=datetime.utcnow()
            )
            
            await self.collection.insert_one(record.dict())
            
        except Exception as e:
            logger.error(f"Error recording rate limit attempt: {e}")
    
    async def cleanup_old_records(self):
        """Clean up old rate limit records (run periodically)"""
        try:
            # Remove records older than 24 hours
            cutoff = datetime.utcnow() - timedelta(hours=24)
            result = await self.collection.delete_many({
                "window_start": {"$lt": cutoff}
            })
            
            if result.deleted_count > 0:
                logger.info(f"Cleaned up {result.deleted_count} old rate limit records")
                
        except Exception as e:
            logger.error(f"Error cleaning up rate limit records: {e}")