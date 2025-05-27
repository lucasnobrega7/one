from fastapi import FastAPI
from datetime import datetime
import os
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Agentes de Conversão API",
    description="API for managing AI agents and conversations",
    version="2.0.0"
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Agentes de Conversão API",
        "version": "2.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

@app.get("/api/test")
def test_endpoint():
    return {
        "message": "API is working correctly",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"🚀 Starting Agentes de Conversão API v2.0 on Railway")
    logger.info(f"📡 Port: {port}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )