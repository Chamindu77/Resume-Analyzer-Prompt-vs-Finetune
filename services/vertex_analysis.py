import os
import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

PROJECT_ID = "resume-470606"
LOCATION = "us-central1"
ENDPOINT_ID = "8879799941942214656"  # your Gemini model ID

SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service_account.json")

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    credentials.refresh(Request())
    return credentials.token

def vertex_analyze_resume(resume, job_description):
    access_token = get_access_token()
    url = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/endpoints/{ENDPOINT_ID}:predict"
    # url = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/models/{MODEL_ID}:generateContent"

    # Payload for Gemini generative model (use 'instances' key)
    payload = {
        "instances": [
            {
                "role": "user",
                "parts": [
                    {"text": f"Job Description:\n{job_description}\n\nResume:\n{resume}"}
                ]
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))
    if response.status_code == 200:
        result = response.json()
        # Parse the result according to your model's output schema
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        return {
            "output": text,
            "raw": result,
            "source": "vertex-gemini-finetuned"
        }
    else:
        print(f"Vertex AI API error: {response.status_code} {response.text}")
        return {
            "output": None,
            "raw": response.text,
            "source": "vertex-gemini-finetuned"
        }
