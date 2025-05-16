from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import MySQLdb
import random
from django.conf import settings
import requests
from django.http import JsonResponse


def get_db_connection():
    return MySQLdb.connect(
        host=settings.DATABASES['default']['HOST'],
        user=settings.DATABASES['default']['USER'],
        passwd=settings.DATABASES['default']['PASSWORD'],
        db=settings.DATABASES['default']['NAME']
    )

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            print(f"Email: {email}, Password: {password}")
            
            db = get_db_connection()
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
            
            db = get_db_connection()
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
            db = get_db_connection()
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

@csrf_exempt
def handle_vacancy(request):
    if request.method == 'POST':
        try:
            db = get_db_connection()
            cursor = db.cursor()

            data = json.loads(request.body)
            userId = data.get("userId")
            vacancyName = data.get('vacancyName')
            vacancyDescription = data.get("vacancyDescription")
            fileUrl = data.get("fileUrl")
            selectedSocials = data.get("selectedSocials")
            selectedSocials = ', '.join(selectedSocials) if isinstance(selectedSocials, list) else selectedSocials
            vacancyState = data.get("vacancyState")

            queryAdminId = "SELECT id_user FROM user WHERE user_type = %s"
            cursor.execute(queryAdminId, ("magneto", ))
            resultAdmin = cursor.fetchall()
            idsAdmin = [row[0] for row in resultAdmin]
            id_aleatorio = random.choice(idsAdmin)

            
            # Insertar el nuevo usuario
            query = "INSERT INTO vacancy (id_user, vacancyName, vacancyDescription, fileUrl, selectedSocials, state) VALUES(%s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (userId, vacancyName, vacancyDescription, fileUrl, selectedSocials, vacancyState, ))
            db.commit()

            cursor.execute("SELECT LAST_INSERT_ID()")
            id_vacancy = cursor.fetchone()[0]

            queryRequest = "INSERT INTO adminRequest (id_user, idVacante) VALUES(%s, %s)"
            cursor.execute(queryRequest, (id_aleatorio, id_vacancy,))
            db.commit()
            
            return JsonResponse({"message": "Vacancy uploaded"}, status=201)
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
def load_vacancys(request):
    if request.method == 'GET':
        try:
            db = get_db_connection()
            cursor = db.cursor()

            userId = request.GET.get("userId")

            
            query = "SELECT v.*, ar. suggestEdit FROM vacancy v JOIN adminRequest ar ON v.idVacante = ar.idVacante WHERE v.id_user = %s"
            cursor.execute(query, (userId,))
            result = cursor.fetchall()

            vacancysList = [
                {"vacancyId": row[0],
                 "time": row[1],
                 "vacancyName": row[2],
                 "fileUrl": row[4],
                 "selectedSocials": row[5],
                 "vacancyDescription": row[6],
                 "vacancyState": row[7],
                 "suggestEdit": row[8]} for row in result
            ]
            
            return JsonResponse({"vacancys": vacancysList}, status=200)
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
def load_requests(request):
    if request.method == 'GET':
        try:
            db = get_db_connection()
            cursor = db.cursor()

            userId = request.GET.get("userId")

            
            query = "SELECT v.*, u.email, u.nombreEmpresa, ar.idVacante, ar.suggestEdit FROM adminRequest ar JOIN vacancy v ON ar.idVacante = v.idVacante JOIN user u on v.id_user = u.id_user WHERE ar.id_user = %s"
            cursor.execute(query, (userId,))
            result = cursor.fetchall()

            requestList = [
                {"vacancyId": row[0],
                 "vacancyName": row[2],
                 "fileUrl": row[4],
                 "selectSocials": row[5],
                 "vacancyDescription": row[6],
                 "requestState": row[7],
                 "email": row[8],
                 "nombreEmpresa": row[9],
                 "idRequest": row[10],
                 "suggestEdit": row[11]} for row in result
            ]
            
            return JsonResponse({"requests": requestList}, status=200)
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
def suggest_edit(request):
    if request.method == 'PATCH':
        try:
            db = get_db_connection()
            cursor = db.cursor()

            data = json.loads(request.body)
            idRequest = data.get("idRequest")
            suggestEdit = data.get("suggestEdit")
            
            query = "UPDATE adminRequest SET suggestEdit = %s WHERE idVacante = %s;"
            cursor.execute(query, (suggestEdit, idRequest,))
            db.commit()
            
            query = "UPDATE vacancy SET state = 'update' WHERE idVacante = %s;"
            cursor.execute(query, (idRequest,))
            db.commit()
            
            return JsonResponse({"message": "suggest edit changed"}, status=201)
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
def post_to_instagram(request):
    if request.method == 'POST':
        try:
            db = get_db_connection()
            cursor = db.cursor()

            data = json.loads(request.body)
            idVacancy = data.get("idRequest")
            accessToken = "EAAPJ7bYKl3YBOZCI4Obi7BjmZCHUxsl7XMJxy84aIMLdamxZCsFxS9vCwHZA6ioAGrNqVgz6xZCBeDXaI6bI8rqcdGJ8eHJpkKB9c8JJPZBmnmKEnmyC5VBiZA50x9DzeDXAt4GIe81ZAOjDptmwpaF0jzZAHXdKlZAdvSacfEjI87DUcbGNTHgeJh0f7IvRnWFMUIbszMr5ZBeAtALfCK1XzWyywZDZD"
            
            query = "SELECT fileUrl, vacancyDescription FROM vacancy WHERE idVacante = %s;"
            cursor.execute(query, (idVacancy,))
            result = cursor.fetchall()
            content = {
                "fileUrl": result[0][0],
                "post_caption": result[0][1]
            }
            
            instagram_account_id = get_instagram_account_id(accessToken)
            if not instagram_account_id:
                return JsonResponse({"message": "no ig id"}, status=400)
            print(instagram_account_id)
            
            media_id = upload_image_to_instagram(accessToken, instagram_account_id, content)
            print(media_id)
            
            if not media_id:
                return JsonResponse({"message": "failed to upload post"}, status=400)
            
            success = publish_to_instagram(accessToken, instagram_account_id, media_id)
            
            if success:
                query = "UPDATE vacancy SET state = 'published' WHERE idVacante = %s;"
                cursor.execute(query, (idVacancy,))
                db.commit()
                return JsonResponse({"message": "success"}, status=201)
            else:
                return JsonResponse({"message": "failed to publish post"}, status=400)
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

def get_instagram_account_id(accessToken):
    
    page_id = "627776677090212"
    response = requests.get(f"https://graph.facebook.com/v22.0/{page_id}?fields=instagram_business_account&access_token={accessToken}")
    data = response.json()
    
    if "instagram_business_account" in data:
        return data["instagram_business_account"]["id"]
    else:
        return None
    

def upload_image_to_instagram(access_token, instagram_account_id, content):
    url = f'https://graph.facebook.com/v22.0/{instagram_account_id}/media'
    params = {
        "image_url": content["fileUrl"], "caption": content["post_caption"], "access_token": access_token,
        }
    response = requests.post(url, data = params)
    data = response.json()
    return data.get("id")

def publish_to_instagram(accessToken, instagram_account_id, media_id):
    response = requests.post(f'https://graph.facebook.com/v22.0/{instagram_account_id}/media_publish', {
        "creation_id": media_id,
        "access_token": accessToken,
    })
    data = response.json()
    return "id" in data

@csrf_exempt
def handle_edit_vacancy(request):
    if request.method == 'POST':
        try:
            db = get_db_connection()
            cursor = db.cursor()

            data = json.loads(request.body)
            idVacancy = data.get("vacancyId")
            fields = data.get("fields_to_edit", [])
            edits = data.get("edits", [])
            
            for field, edit in zip(fields, edits):
                query = f"UPDATE vacancy SET {field} = %s WHERE idVacante = %s;"
                cursor.execute(query, (edit, idVacancy,))
                db.commit()
                
            query = 'UPDATE vacancy SET state = "review" WHERE idVacante = %s'
            cursor.execute(query, (idVacancy,))
            db.commit()
                
            return JsonResponse({"message": "success"}, status=201)
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
