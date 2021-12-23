from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt_identity
from flask_jwt_extended.utils import get_jwt
from .models import User
from werkzeug.security import check_password_hash
from .utils import create_json_data, login_required, get_user_from_jwt
from . import db
import time

auth = Blueprint("auth", __name__)

def login(user_name, password):
    user = User.query.filter_by(user_name = user_name).first()
    if user:
        if check_password_hash(user.password, password):
            return user
    return None

@auth.route("/create_token", methods=["POST", "OPTIONS"])
def create_token():
    user_name = request.json.get("user_name", None)
    password = request.json.get("password", None)
    if not user_name or not password:
        return create_json_data(msg="Kullanıcı Adı ve Şifre Girilmeli")
    if len(user_name) > 50 or len(user_name) < 5:
        return create_json_data(msg="Kullanıcı Adı 5-50 Karakter Uzunluğunda Olmalı")
    if len(password) > 100 or len(password) < 5:
        return create_json_data(msg="Şifre 5-100 Karakter Uzunluğunda Olmalı")
    user = login(user_name, password)
    if not user:
        return create_json_data(msg="Kullanıcı Adı Veya Şifre Hatalı")
    acces_token = create_access_token(identity=user_name, additional_claims={"super_user": user.super_user})
    user.jwt = "Bearer " + acces_token
    db.session.commit()
    context = {
        "token": acces_token,
        "super_user": user.super_user
    }
    return create_json_data(status = "succes", context = context)

@auth.route("/delete_token", methods=["POST", "OPTIONS"])
@login_required()
def delete_token():
    user = get_user_from_jwt()
    user.jwt = ""
    db.session.commit()
    return create_json_data(status = "succes")

@auth.route("/get_user_info", methods=["POST", "OPTIONS"])
@login_required()
def get_user_info():
    claims = get_jwt()
    
    context = {
        "user_name" : get_jwt_identity(),
        "super_user" : claims.get("super_user")
    }
    return create_json_data(status = "succes", context = context)
