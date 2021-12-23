import json
from os import stat
from flask import Blueprint, request
from .utils import admin_required, create_json_data, login_required, get_user_from_jwt
from .models import Order, Cafe, OldOrder
from . import db
from datetime import datetime

order = Blueprint("order", __name__)

def get_orders_from_id(table_id):
    orders = Order.query.filter_by(table_id = table_id).all()
    order_list = []
    for order in orders:
        order_obj = {
            "id" : order.id,
            "product_id" : order.product_id,
            "name" : order.get_name(),
            "count" : order.count,
            "cost" : order.get_cost(),
            "active" : order.active,
            "discount" : order.discount,
            "note" : order.note
        }
        
        order_list.append(order_obj)
    return order_list

@order.route("/order/get_tables", methods=["POST", "OPTIONS"])
@login_required()
def get_tables():
    orders = Order.query.all()
    cafe = Cafe.query.first()
    table_size = 0
    if cafe:
        table_size = cafe.table_size
    table_list = [] 
    busy_list = []
    for order in orders:
        if order.table_id not in busy_list:
            busy_list.append(order.table_id)
    for i in range(table_size):
        table_obj = {
            "id" : i,
            "busy" : True if i in busy_list else False
        }
        table_list.append(table_obj)
    
    return create_json_data(status="succes", context= {"data" : table_list})


@order.route("/order/get_orders", methods=["POST", "OPTIONS"])
@login_required()
def get_orders():
    id = request.json.get("id", None)
    try:
        id = int(id)
    except:
        id = -1
    if id < 0:
        return create_json_data(msg="Id Gerekiyor!")
    table_size = 0
    cafe = Cafe.query.first()
    if cafe:
        table_size = cafe.table_size
    if id > table_size:
        return create_json_data(msg="Masa Bulunamadı")
    
    return create_json_data(status="succes", context={"data" : get_orders_from_id(id)})
       
@order.route("/order/set_orders", methods=["POST", "OPTIONS"])
@login_required()
def set_orders():
    data = request.json.get("data", None)
    table_id = request.json.get("table_id", None)
    new_order_list = []
    if not data:
        return create_json_data(msg="Veri Yok")
    try:
        new_order_list = json.loads(data)
    except:
        return create_json_data(msg="Sipariş Hatalı")
    try:
        table_id = int(table_id)
    except:
        return create_json_data(msg="Masa Hatalı")
    if not new_order_list:
        return create_json_data(msg="Sipariş Boş")
    old_order_list = Order.query.filter_by(table_id = table_id).all()
    if old_order_list:
        for order in old_order_list:
            db.session.delete(order)
    for order in new_order_list:
        new_order = Order(count = order["count"], table_id = table_id, product_id = order["product_id"], active = order["active"], discount = order["discount"], note = order["note"] )
        db.session.add(new_order)  
    db.session.commit()
    return create_json_data(status="succes")

@order.route("/order/pay", methods=["POST", "OPTIONS"])
@login_required()
def order_pay():
    table_id = request.json.get("table_id", None)
    try:
        table_id = int(table_id)
    except:
        return create_json_data(msg="Masa Hatalı")
    
    orders = Order.query.filter_by(table_id = table_id).all()
    if not orders:
        return create_json_data(msg="Masa Boş")     
    order_list = []
    pay_total = 0
    profit = 0
    for order in orders:
        cost = order.get_cost()
        order_obj = {
            "id" : order.id,
            "product_id" : order.product_id,
            "name" : order.get_name(),
            "count" : order.count,
            "cost" : cost,
            "active" : order.active,
            "discount" : order.discount,
            "note" : order.note
            }
        if order.active:
            pay_total += (cost * order.count)
            profit += order.get_profit()
        order_list.append(order_obj) 
        product = order.get_product()
        if product:
            product.stock -= order.count
            if product.stock < 0:
                product.stock = 0
        db.session.delete(order)
    user = get_user_from_jwt()
    if not user:
        return create_json_data(msg="Kullanıcı Bulunamadı")
    old_order = OldOrder(data = json.dumps(order_list), user_id = user.id, user_name = user.user_name, pay_total = pay_total, profit=profit) 
    db.session.add(old_order)
    db.session.commit()
    return create_json_data(status="succes")

@order.route("/order/change_table", methods=["POST", "OPTIONS"])
@login_required()
def change_table():
    from_id = request.json.get("from_id", None)
    to_id = request.json.get("to_id", None)
    try:
        from_id = int(from_id)
    except:
        from_id = -1
    try:
        to_id = int(to_id)
    except:
        to_id = -1
    if from_id < 0:
        return create_json_data(msg="Id Gerekiyor!")
    if to_id < 0:
        return create_json_data(msg="Id Gerekiyor!")
    if from_id == to_id:
        return create_json_data(msg="Aynı Masaya Aktarım Yapılamaz!")
    orders = Order.query.filter_by(table_id = from_id).all()
    if not orders:
        return create_json_data(msg="Masa Boş Aktarım Yapılamaz!")
    if Order.query.filter_by(table_id = to_id).first():
        return create_json_data(msg="Aktarım Yapılacak Masa Dolu!")
    for order in orders:
        order.table_id = to_id
    db.session.commit()
    return create_json_data(status="succes")


@order.route("/order/close_table", methods=["POST", "OPTIONS"])
@login_required()
def close_table():
    id = request.json.get("id", None)
    try:
        id = int(id)
    except:
        id = -1
    if id < 0:
        return create_json_data(msg="Id Gerekiyor!")
    
    
    orders = Order.query.filter_by(table_id = id).all()
    if not orders:
        return create_json_data(msg="Masa Boş")   
    
    for order in orders:
        db.session.delete(order)
    db.session.commit()
    return create_json_data(status="succes")

@order.route("/order/get_old_orders", methods=["POST", "OPTIONS"])
@admin_required()
def get_old_orders():
    start_date_timestamp = request.json.get("start_date", None)
    end_date_timestamp = request.json.get("end_date", None)
    start_date = None
    end_date = None
    try:
        start_date_timestamp = int(start_date_timestamp)
        start_date = datetime.fromtimestamp(start_date_timestamp/1000.0)
    except:
        return create_json_data(msg="Başlangıç Tarihi Bozuk!")
    try:
        end_date_timestamp = int(end_date_timestamp)
        end_date = datetime.fromtimestamp(end_date_timestamp/1000.0)
    except:
        return create_json_data(msg="Bitiş Tarihi Bozuk!")
    if end_date_timestamp < start_date_timestamp:
        return create_json_data(msg="Bitiş Tarihi Başlangıç Tarihinden Küçük")
    if end_date_timestamp == start_date_timestamp:
        return create_json_data(msg="Bitiş Tarihi ve Başlangıç Tarihi Aynı")
    
    old_orders = OldOrder.query.filter((OldOrder.order_date > start_date) & (OldOrder.order_date < end_date)).all()
    if not old_orders:
        return create_json_data(msg="Bu Tarihlerde Sipariş Yok")   

    old_order_list = []
    for old_order in old_orders:
        old_order_obj = {
            "id" : old_order.id,
            "data" : json.loads(old_order.data),
            "order_date" : old_order.order_date.strftime("%d.%m.%Y, %H:%M"),
            "user_id" : old_order.user_id,
            "user_name" : old_order.user_name,
            "pay_total" : old_order.pay_total,
            "profit" : old_order.profit
        }
        old_order_list.append(old_order_obj)  
    
    return create_json_data(status="succes", context={"data":old_order_list})