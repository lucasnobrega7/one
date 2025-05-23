"""
Database management with Prisma Client
Thread-safe database operations for FastAPI
"""

from prisma import Prisma
from typing import Optional
import asyncio
import logging

logger = logging.getLogger(__name__)

# Global Prisma instance
prisma_client: Optional[Prisma] = None

async def get_prisma() -> Prisma:
    """Get thread-safe Prisma client instance"""
    global prisma_client
    
    if prisma_client is None:
        prisma_client = Prisma()
        await prisma_client.connect()
        logger.info("📊 Prisma client connected")
    
    return prisma_client

async def disconnect_prisma():
    """Disconnect Prisma client"""
    global prisma_client
    
    if prisma_client is not None:
        await prisma_client.disconnect()
        prisma_client = None
        logger.info("📊 Prisma client disconnected")

# Dependency for FastAPI
async def get_db() -> Prisma:
    """FastAPI dependency to get database connection"""
    return await get_prisma()

# Context manager for safe database operations
class PrismaManager:
    def __init__(self):
        self.client = None
    
    async def __aenter__(self) -> Prisma:
        self.client = Prisma()
        await self.client.connect()
        return self.client
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.disconnect()

# For SSE generators - create local instance
async def get_local_prisma() -> Prisma:
    """Create local Prisma instance for SSE generators (thread-safe)"""
    local_client = Prisma()
    await local_client.connect()
    return local_client