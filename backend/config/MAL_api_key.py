import os
from dotenv import load_dotenv

load_dotenv()

MAL_KEY = os.getenv("MAL_API_KEY", "")