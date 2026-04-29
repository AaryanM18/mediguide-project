import requests
import json

url = "https://mediguide-project-production.up.railway.app/api/auth/signup"
payload = {
    "user_id": "test_user_unique_1",
    "email": "test_unique_1@example.com",
    "password": "password123"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
