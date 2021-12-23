from cheroot.wsgi import Server as WSGIServer, PathInfoDispatcher
from web import create_app, db, models
import json

app = create_app()
SITE_CONFIG = None


@app.before_first_request
def setup():
    print("Varsayılan Ayarlar Kontrol Ediliyor.")
    from werkzeug.security import generate_password_hash
    if not models.User.query.all():
        from secrets import token_urlsafe
        admin_pw = token_urlsafe(10)
        print(f"---Yönetici Bilgileri---\nKullanıcı Adı:admin\nŞifre:{admin_pw}\n---Yönetici Bilgileri---")
        new_user = models.User(user_name="admin", password=generate_password_hash(admin_pw, method="sha256"), mail="cafe_otomasyon@gmail.com", super_user=1)
        db.session.add(new_user)
        db.session.commit()
        print("Varsayılan Kullanıcı Oluşturuldu.")
    if not models.Cafe.query.all():
        new_cafe = models.Cafe(name = "Cafe Otomasyon", table_size = 0)
        db.session.add(new_cafe) 
        db.session.commit() 
        print("Varsayılan İşletme Ayarları Oluşturuldu")


with open("configs.json", "r") as f:
    jsn_config = json.load(f)
    SITE_CONFIG = jsn_config["SITE_CONFIG"]


d = PathInfoDispatcher({'/': app})
server = WSGIServer((SITE_CONFIG["host"], SITE_CONFIG["port"]), d,)

print()
if __name__ == '__main__':
   try:
      server.start()
   except:
      server.stop()