from flask import Blueprint, request
from .utils import admin_required, create_json_data, login_required
from .models import User, Category, Product, Cafe
from werkzeug.security import check_password_hash, generate_password_hash
import re
from . import db
from time import sleep


management = Blueprint("management", __name__)

def get_user_from_id(id):
    user = User.query.filter_by(id=id).first()
    return user
def get_category_from_id(id):
    category = Category.query.filter_by(id=id).first()
    return category
def get_product_from_id(id):
    product = Product.query.filter_by(id=id).first()
    return product

#User Management End  
@management.route("/management/get_users", methods=["POST", "OPTIONS"])
@admin_required()
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_obj = {
            "id" : user.id,
            "user_name" : user.user_name,
            "password" : "@@@@@@@@@@@@@@@",
            "mail" : user.mail,
            "super_user" : user.super_user
        }
        user_list.append(user_obj)
    return create_json_data(status="succes", context= {"data" : user_list})

@management.route("/management/add_user", methods=["POST", "OPTIONS"])
@admin_required()
def add_user():
    mail_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    user_name = request.json.get("user_name", None)
    password = request.json.get("password", None)
    mail = request.json.get("mail", None)
    super_user = request.json.get("super_user", None)

    if len(user_name) < 5 or len(user_name) > 50:
        return create_json_data(msg="Kullanıcı Adı 5-50 Karakter Uzunluğunda Olmalı!")
    if User.query.filter_by(user_name=user_name).first():
        return create_json_data(msg="Bu Kullanıcı Adı Daha Önce Kullanılmış!")  
    if len(password) < 5 or len(password) > 100:
        return create_json_data(msg="Şifre 5-100 Karakter Uzunluğunda Olmalı!")
    if len(mail) < 5 or len(mail) > 150:
        return create_json_data(msg="Mail 5-150 Karakter Uzunluğunda Olmalı!")
    if not (re.fullmatch(mail_regex, mail)):
        return create_json_data(msg="Geçerli Bir Mail Girmeniz Gerekmekte!")
    if User.query.filter_by(mail=mail).first():
        return create_json_data(msg="Bu Mail Daha Önce Kullanılmış!")
    new_user = User(user_name = user_name, password = generate_password_hash(password, method="sha256"), mail = mail, super_user = super_user)
    db.session.add(new_user)
    db.session.commit()
    return create_json_data(status="succes", context={"id" : new_user.id})

@management.route("/management/edit_user", methods=["POST", "OPTIONS"])
@admin_required()
def edit_user():
    mail_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    id = request.json.get("id", None)
    user_name = request.json.get("user_name", None)
    password = request.json.get("password", None)
    mail = request.json.get("mail", None)
    super_user = request.json.get("super_user", None)
    if not id:
        return create_json_data(msg="Id Gerekiyor!")
    user = get_user_from_id(id)
    if not user:
        return create_json_data(msg="Kullanıcı Bulunamadı")

    if user_name and user_name != user.user_name:
        if len(user_name) < 5 or len(user_name) > 50:
            return create_json_data(msg="Kullanıcı Adı 5-50 Karakter Uzunluğunda Olmalı!")
        if User.query.filter_by(user_name=user_name).first():
            return create_json_data(msg="Bu Kullanıcı Adı Daha Önce Kullanılmış!")
        user.user_name = user_name
        
    if password and password != "@@@@@@@@@@@@@@@":
        if len(password) < 5 or len(password) > 100:
            return create_json_data(msg="Şifre 5-100 Karakter Uzunluğunda Olmalı!")
        user.password = generate_password_hash(password, method="sha256")
    
    if mail and mail != user.mail:
        if len(mail) < 5 or len(mail) > 150:
            return create_json_data(msg="Mail 5-150 Karakter Uzunluğunda Olmalı!")
        if not (re.fullmatch(mail_regex, mail)):
            return create_json_data(msg="Geçerli Bir Mail Girmeniz Gerekmekte!")
        if User.query.filter_by(mail=mail).first():
            return create_json_data(msg="Bu Mail Daha Önce Kullanılmış!")
        user.mail = mail
    if super_user != None:
        user.super_user = super_user
    db.session.commit()
    return create_json_data(status="succes")

@management.route("/management/delete_user", methods=["POST", "OPTIONS"])
@admin_required()
def delete_user():
    id = request.json.get("id", None)
    if not id:
        return create_json_data(msg="Id Gerekiyor!")
    user = get_user_from_id(id)
    if not user:
        return create_json_data(msg="Kullanıcı Bulunamadı")
    db.session.delete(user)
    db.session.commit()
    return create_json_data(status="succes")
#User Management End    
    
#Category Management Start    
@management.route("/management/get_categories", methods=["POST", "OPTIONS"])
@login_required()
def get_categories():
    categories = Category.query.all()
    category_list = []
    for category in categories:
        category_obj = {
            "id" : category.id,
            "name" : category.name
        }
        category_list.append(category_obj)
    return create_json_data(status="succes", context= {"data" : category_list})

@management.route("/management/add_category", methods=["POST", "OPTIONS"])
@admin_required()
def add_category():
    name = request.json.get("name", None)
    if len(name) < 2 or len(name) > 100:
        return create_json_data(msg="Kategori Adı 2-100 Karakter Uzunluğunda Olmalı!")
    if Category.query.filter_by(name=name).first():
        return create_json_data(msg="Bu Kategori Adı Daha Önce Kullanılmış!")  

    new_category = Category(name = name)
    db.session.add(new_category)
    db.session.commit()
    return create_json_data(status="succes", context={"id" : new_category.id})

@management.route("/management/edit_category", methods=["POST", "OPTIONS"])
@admin_required()
def edit_category():
    id = request.json.get("id", None)
    name = request.json.get("name", None)
    if not id:
        return create_json_data(msg="Id Gerekiyor!")
    category = get_category_from_id(id)
    if not category:
        return create_json_data(msg="Kategori Bulunamadı")

    if name and name != category.name:
        if len(name) < 2 or len(name) > 100:
            return create_json_data(msg="Kategori Adı 2-100 Karakter Uzunluğunda Olmalı!")
        if Category.query.filter_by(name=name).first():
            return create_json_data(msg="Bu Kategori Adı Daha Önce Kullanılmış!")
        category.name = name
        
    db.session.commit()
    return create_json_data(status="succes")

@management.route("/management/delete_category", methods=["POST", "OPTIONS"])
@admin_required()
def delete_category():
    id = request.json.get("id", None)
    if not id:
        return create_json_data(msg="Id Gerekiyor!")
    category = get_category_from_id(id)
    if not category:
        return create_json_data(msg="Kategori Bulunamadı")
    db.session.delete(category)
    db.session.commit()
    return create_json_data(status="succes")
#Category Management End

#Product Management Start
@management.route("/management/get_products", methods=["POST", "OPTIONS"])
@login_required()
def get_products():
    products = Product.query.all()
    product_list = []
    for product in products:
        product_obj = {
            "id" : product.id,
            "name" : product.name,
            "stock" : product.stock,
            "cost" : product.cost,
            "base_cost" : product.base_cost,
            "category_id" : product.category_id,
            "category_name" : product.get_category_name(),
            "tax" : product.tax    
        }
        product_list.append(product_obj)
    return create_json_data(status="succes", context= {"data" : product_list})

@management.route("/management/add_product", methods=["POST", "OPTIONS"])
@admin_required()
def add_product():
    name = request.json.get("name", None)
    stock = request.json.get("stock", None)
    cost = request.json.get("cost", None)
    base_cost = request.json.get("base_cost", None)
    category_id = request.json.get("category_id", None)
    tax = request.json.get("tax", None)
    
    try:
        cost = float(cost)
    except:
        cost = -1
    try:
        base_cost = float(base_cost)
    except:
        base_cost = -1
    try:
        stock = int(stock)
    except:
        stock = -1
    try:
        category_id = int(category_id)
    except:
        category_id = -1
    try:
        tax = int(tax)
    except:
        tax = -1

    if len(name) < 2 or len(name) > 100:
        return create_json_data(msg="Ürün Adı 2-100 Karakter Uzunluğunda Olmalı!")
    if Product.query.filter_by(name=name).first():
        return create_json_data(msg="Bu Ürün Adı Daha Önce Kullanılmış!")  
    if stock < 0:
        return create_json_data(msg="Ürün Adeti -1'den Büyük Olmalı!")  
    if cost < 0:
        return create_json_data(msg="Ürün Fiyatı -1'den Büyük Olmalı!")  
    if base_cost < 0:
        return create_json_data(msg="Ürün Alış Fiyatı -1'den Büyük Olmalı!")  
    if category_id < 0:
        return create_json_data(msg="Kategori Seçilmesi Gerekiyor!") 
    if tax < 0:
        return create_json_data(msg="Vergi Oranı -1'den Büyük Olmalı!") 

    new_product = Product(name=name, cost=cost, base_cost=base_cost, stock=stock, category_id=category_id, tax=tax)
    db.session.add(new_product)
    db.session.commit()
    return create_json_data(status="succes", context={"id" : new_product.id})

@management.route("/management/edit_product", methods=["POST", "OPTIONS"])
@admin_required()
def edit_product():
    id = request.json.get("id", None)
    name = request.json.get("name", None)
    stock = request.json.get("stock", None)
    cost = request.json.get("cost", None)
    base_cost = request.json.get("base_cost", None)
    category_id = request.json.get("category_id", None)
    tax = request.json.get("tax", None)
    
    if not id:
        return create_json_data(msg="Id Gerekiyor!")
    product = get_product_from_id(id)
    if not product:
        return create_json_data(msg="Ürün Bulunamadı")

    try:
        cost = float(cost)
    except:
        cost = -1
    try:
        base_cost = float(base_cost)
    except:
        base_cost = -1
    try:
        stock = int(stock)
    except:
        stock = -1
    try:
        category_id = int(category_id)
    except:
        category_id = -1
    try:
        tax = int(tax)
    except:
        tax = -1
    
    
    if name and name != product.name:
        if len(name) < 2 or len(name) > 100:
            return create_json_data(msg="Ürün Adı 2-100 Karakter Uzunluğunda Olmalı!")
        if Product.query.filter_by(name=name).first():
            return create_json_data(msg="Bu Ürün Adı Daha Önce Kullanılmış!")
        product.name = name
    if stock >= 0 and stock != product.stock:
        product.stock = stock
    if cost >= 0 and cost != product.cost:
        product.cost = cost
    if base_cost >= 0 and base_cost != product.base_cost:
        product.base_cost = base_cost
    if category_id >= 0 and category_id != product.category_id:
        product.category_id = category_id
    if tax >= 0 and tax != product.tax:
        product.tax = tax
       
    db.session.commit()
    return create_json_data(status="succes")

@management.route("/management/delete_product", methods=["POST", "OPTIONS"])
@admin_required()
def delete_product():
    id = request.json.get("id", None)
    if not id:
        return create_json_data(msg="Id Gerekiyor!")
    product = get_product_from_id(id)
    if not product:
        return create_json_data(msg="Ürün Bulunamadı")
    db.session.delete(product)
    db.session.commit()
    return create_json_data(status="succes")
#Product Management End

#Cafe Management Start
@management.route("/get_site_config", methods=["POST", "OPTIONS"])
def get_site_config():
    cafe = Cafe.query.all()
    context = {
        "name" : "Cafe Otomasyon",
        "table_size" : 0
    }
    if cafe:
        cafe = cafe[0]
        context.update({
            "name" : cafe.name,
            "table_size" : cafe.table_size   
        })
    return create_json_data(status="succes", context=context)

@management.route("/management/edit_site_config", methods=["POST", "OPTIONS"])
@admin_required()
def edit_site_config():
    name = request.json.get("name", None)
    table_size = request.json.get("table_size", None)
    cafe  = Cafe.query.all()
    if not cafe:
        return create_json_data(msg="Site Ayarları Bulunamadı")
    cafe = cafe[0]

    try:
        table_size = int(table_size)
    except:
        table_size = -1
        
    if name and name != cafe.name:
        if len(name) < 2 or len(name) > 30:
            return create_json_data(msg="Site Adı 2-30 Karakter Uzunluğunda Olmalı!")
        cafe.name = name
    if table_size >= 0 and table_size != cafe.table_size:    
        cafe.table_size = table_size
    
    db.session.commit()
    return create_json_data(status="succes")
#Cafe Management End