import logging
from app.config_loader import load_config

config = load_config()

logging.basicConfig(
    level=getattr(logging, config["logging"]["level"], "INFO"),
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("RAG_Chatbot")
