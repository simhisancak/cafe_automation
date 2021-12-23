from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import json

DB_CONFIG = None
SECRETS = None

with open("configs.json", "r") as f:
    jsn_config = json.load(f)
    DB_CONFIG = jsn_config["DB_CONFIG"]
    SECRETS = jsn_config["SECRETS"]
    
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=DB_CONFIG["postgresUser"], pw=DB_CONFIG["postgresPass"], url=DB_CONFIG["postgresUrl"], db=DB_CONFIG["postgresDb"])

db = SQLAlchemy()
jwt = JWTManager()



def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = SECRETS["SECRET_KEY"]
    app.config["JWT_SECRET_KEY"] = SECRETS["JWT_SECRET_KEY"]
    app.config["JWT_ERROR_MESSAGE_KEY"] = "jwt_error"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    from .auth import auth
    from .management import management
    from .order import order
    
    app.register_blueprint(auth, url_prefix="/api/")
    app.register_blueprint(management, url_prefix="/api/")
    app.register_blueprint(order, url_prefix="/api/")
    
    from .models import User, Category, Product, Cafe, Order, OldOrder
    create_database(app)
    
    jwt.init_app(app)
    print("Api Başlatıldı!")
    return app

def create_database(app):
    db.create_all(app=app)
    print("Database Oluşturuldu!")
        