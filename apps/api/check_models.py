
import google.generativeai as genai
import os
from config import settings

print(f"Checking models with key: {settings.GEMINI_API_KEY[:5]}...")
genai.configure(api_key=settings.GEMINI_API_KEY)

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
