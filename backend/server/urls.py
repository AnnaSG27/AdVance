from django.urls import path
from .views import *

urlpatterns = [
    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
    path("edit_profile/", edit_profile, name="edit_profile"),
    path("handle_vacancy/", handle_vacancy, name="handle_vacancy"),
    path("load_vacancys/", load_vacancys, name="load_vacancys"),
    path("load_requests/", load_requests, name="load_requests"),
    path("suggest_edit/", suggest_edit, name="suggest_edit"),
    path("post_to_instagram/", post_to_instagram, name="post_to_instagram"),
    path("handle_edit_vacancy/", handle_edit_vacancy, name="handle_edit_vacancy"),
]