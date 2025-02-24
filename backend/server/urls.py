from django.urls import path
from .views import *

urlpatterns = [
    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
    path("edit_profile/", edit_profile, name="edit_profile"),
    path("handle_vacancy/", handle_vacancy, name="handle_vacancy"),
    path("load_vacancys/", load_vacancys, name="load_vacancys"),
]