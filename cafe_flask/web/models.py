from . import db
from datetime import datetime


class User (db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_name = db.Column(db.String(50), unique = True)
    password = db.Column(db.String(100))
    mail = db.Column(db.String(150), unique = True)
    super_user = db.Column(db.Boolean())
    jwt = db.Column(db.String(350))
    
class Cafe(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    table_size = db.Column(db.Integer)
    
class Category(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    products = db.relationship("Product")
    
class Product(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    cost = db.Column(db.Float)
    base_cost = db.Column(db.Float)
    stock = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"))
    tax = db.Column(db.Integer)
    order = db.relationship("Order")

    def get_category_name(self):
        category = Category.query.filter_by(id=self.category_id).first()
        if category:
            return category.name
        return "Kategori Bulunamadı"
    
class Order(db.Model):
    id = db.Column(db.BigInteger, primary_key = True) 
    count = db.Column(db.Integer)
    table_id = db.Column(db.Integer)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    active = db.Column(db.Boolean(), default=True)
    discount = db.Column(db.Float, default=0)
    note = db.Column(db.String(200))
    
    def get_product(self):
        return Product.query.filter_by(id=self.product_id).first()
    def get_name(self):
        product = Product.query.filter_by(id=self.product_id).first()
        if product:
            return product.name
        elif self.discount != 0:
            return ""
        return "Ürün Bulunamaadı"
    def get_cost(self):
        product = Product.query.filter_by(id=self.product_id).first()
        if product:
            return product.cost - self.discount
        elif self.discount != 0:
            return self.discount
        return 0
    def get_profit(self):
        product = Product.query.filter_by(id=self.product_id).first()
        if product:
            total_pay = (((product.cost - self.discount) - product.base_cost) * self.count)
            return (total_pay - ((total_pay * product.tax) / 100))
        return 0
       
    
    
class OldOrder(db.Model):
    id = db.Column(db.BigInteger, primary_key = True)
    data = db.Column(db.String(10000))
    order_date = db.Column(db.DateTime(timezone = True), default = datetime.now())
    user_id = db.Column(db.Integer)
    user_name = db.Column(db.String(100))
    pay_total = db.Column(db.Float)
    profit = db.Column(db.Float)
