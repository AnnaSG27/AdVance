from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            print(f"Email: {email}, Password: {password}")
            
            # Aquí puedes agregar la lógica para autenticar al usuario
            if email == "test@example.com" and password == "password123":
                return JsonResponse({"message": "Login successful"}, status=200)
            else:
                return JsonResponse({"message": "Invalid credentials"}, status=400)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return JsonResponse({"message": "Invalid JSON"}, status=400)
        except Exception as e:
            print(f"Unexpected error: {e}")
            return JsonResponse({"message": "Internal server error"}, status=500)
    
    print("Invalid request method")
    return JsonResponse({"message": "Invalid request method"}, status=405)