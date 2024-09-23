import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")  # Default to OpenAI


def get_llm_config():
    if LLM_PROVIDER == "openai":
        return {
            "config_list": [{"model": OPENAI_MODEL, "api_key": OPENAI_API_KEY}],
            "temperature": 0.7,
            "max_tokens": 10000,
        }
    elif LLM_PROVIDER == "anthropic":
        return {
            "config_list": [{"model": ANTHROPIC_MODEL, "api_key": ANTHROPIC_API_KEY}],
            "temperature": 0.7,
            "max_tokens": 8192,
        }
    else:
        raise ValueError(f"Unsupported LLM provider: {LLM_PROVIDER}")


def get_llm_config_for_autogen():
    base_config = get_llm_config()
    if LLM_PROVIDER == "anthropic":
        return {
            **base_config,
            "config_list": [
                {
                    "model": ANTHROPIC_MODEL,
                    "api_key": ANTHROPIC_API_KEY,
                    "api_base": "https://api.anthropic.com",
                    "api_type": "anthropic",
                }
            ],
        }
    return base_config
