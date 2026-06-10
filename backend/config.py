"""
MediSense AI - Configuration
Environment-based configuration management
"""
import os

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'medisense-dev-key')
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
    GROQ_MODEL = "llama-3.3-70b-versatile"
    MAX_TOKENS = 500
    DB_PATH = 'medisense.db'
    MODEL_PATH = 'models'
    CORS_ORIGINS = [
        "https://medisense-india.vercel.app",
        "http://localhost:3000"
    ]

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}