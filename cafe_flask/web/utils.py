import json
from flask import request
from flask_jwt_extended.view_decorators import verify_jwt_in_request
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from .models import User

def create_json_data(status = "error", msg = "", context = None):
    data = {
        "status" : status,
        "msg" : msg
    }
    if context:
        data.update(context)
        
    return json.dumps(data)

def get_user_from_jwt():
    token = request.headers.get("Authorization")
    user = User.query.filter_by(user_name = get_jwt_identity(), jwt = token).first()
    return user

def login_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user = get_user_from_jwt()
            if user:
                return fn(*args, **kwargs)
            else:
                return create_json_data(context = {"jwt_error" : "Wrong Token"}), 403

        return decorator

    return wrapper

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user = get_user_from_jwt()
            if user:
                if user.super_user:
                    return fn(*args, **kwargs)
                else:
                    return create_json_data(context = {"jwt_error" : "Admin Required"}), 403
            else:
                return create_json_data(context = {"jwt_error" : "Wrong Token"}), 403

        return decorator

    return wrapper

