## Kurulum için gerekli olan bilgiler klasörlerde mevcut.

### Örnek Nginx Config Dosyası
```nginx
server {
    listen 80;
    server_name cafe_react.com www.cafe_react.com;
    root /var/www/react_cafe;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
    }
    location /api {
        proxy_pass http://192.168.1.40:5000;
    }
}
```