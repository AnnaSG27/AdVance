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
                host="localhost",
                user="root",
                passwd="Pastel112233",
                db="advance_db"
            )
            cursor = db.cursor()
            

            checkEmailQuery = "SELECT * FROM user WHERE email = %s"
            cursor.execute(checkEmailQuery, (email,))
            resultEmail = cursor.fetchone()
            if not resultEmail:
                return JsonResponse({"message": "Email does not exists"}, status=400)
            
            query = "SELECT * FROM user WHERE email = %s AND password = %s"
            cursor.execute(query, (email, password))
            result = cursor.fetchone()
        
            if result:
                return JsonResponse({"message": "Login successful", "id": result[0], "email": result[1], "password": result[2], "description": result[3], "nombreEmpresa": result[4], "userType": result[5]}, status=200)
            else:
                return JsonResponse({"message": "Invalid password"}, status=400)
            
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

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            nombreEmpresa = data.get('nombreEmpresa')
            userType = data.get('userType')
            
            db = MySQLdb.connect(
                host="localhost",
                user="root",
                passwd="Pastel112233",
                db="advance_db"
            )
            cursor = db.cursor()
            
            # Verificar si el correo electrónico ya existe
            check_query = "SELECT * FROM user WHERE email = %s"
            cursor.execute(check_query, (email,))
            result = cursor.fetchone()
            
            if result:
                return JsonResponse({"message": "User already exists"}, status=400)
            
            # Insertar el nuevo usuario
            query = "INSERT INTO user (email, password, nombreEmpresa, user_type) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (email, password, nombreEmpresa, userType))
            db.commit()

            userId = cursor.lastrowid
            
            return JsonResponse({"message": "User registered successfully", "id": userId, "email": email, "password": password, "nombreEmpresa": nombreEmpresa, "userType": userType}, status=201)
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

@csrf_exempt
def edit_profile(request):
    if request.method == 'PATCH':
        try:
            db = MySQLdb.connect(
                host="localhost",
                user="root",
                passwd="Pastel112233",
                db="advance_db"
            )
            cursor = db.cursor()

            data = json.loads(request.body)
            userId = data.get("userId")
            fieldEdit = data.get('fieldToEdit')
            infoEdit = data.get("newValue")
            print(f"User ID: {userId}, Field to edit: {fieldEdit}, New value: {infoEdit}")

            if fieldEdit == "email":
                check_query = "SELECT email FROM user WHERE email = %s AND id_user != %s"
                cursor.execute(check_query, (infoEdit, userId))
                result = cursor.fetchone()
                print(result)

                if result:
                    return JsonResponse({"message": "This email already exists"}, status=400)
            
            # Insertar el nuevo usuario
            query = f"UPDATE user SET {fieldEdit} = %s WHERE id_user = %s;"
            cursor.execute(query, (infoEdit, userId))
            db.commit()
            
            return JsonResponse({"message": "Field successfully changed", "field": fieldEdit, "change": infoEdit }, status=201)
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