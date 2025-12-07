import google.generativeai as genai
import os
from dotenv import load_dotenv
import sys

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

models_to_try = ['models/gemini-1.5-flash', 'models/gemini-pro']

with open('test_output.txt', 'w', encoding='utf-8') as f:
    for model_name in models_to_try:
        f.write(f"Testing {model_name}...\n")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello")
            f.write(f"Success with {model_name}\n")
            break
        except Exception as e:
            f.write(f"Failed with {model_name}: {str(e)}\n")
