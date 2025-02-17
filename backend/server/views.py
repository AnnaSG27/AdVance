from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import MySQLdb

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            print(f"Email: {email}, Password: {password}")
            
            db = MySQLdb.connect(
                host = "localhost",
                user = "root",
                passwd = "Pastel112233",
                db = "advance_db"
            )
            cursor = db.cursor()
            
            query = "SELECT * FROM user WHERE email = %s AND password = %s"
            cursor.execute(query, (email, password))
            result = cursor.fetchone()
            
            if result:
                return JsonResponse({"message": "Login successful", "email": result[1], "password": result[2], "description": result[3]}, status=200)
            else:
                return JsonResponse({"message": "Invalid credentials"}, status=400)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return JsonResponse({"message": "Invalid JSON"}, status=400)
        except Exception as e:
            print(f"Unexpected error: {e}")
            return JsonResponse({"message": "Internal server error"}, status=500)
        finally:
            if db:
                db.close()
    
    print("Invalid request method")
    return JsonResponse({"message": "Invalid request method"}, status=405)