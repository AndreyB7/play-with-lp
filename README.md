## The Game

### Run app in docker environment
1. Install docker and docker compose
2. Create _.env_ file:
```shell
$ echo 'PASSWORD=password' > .env
```
2. Run app:
```shell
$ sudo docker compose up -d
```

### Run on VM
0. Git
```shell
git clone github-repo-url
git pull
```
1. Install node
```shell
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. Install deps and build 
```shell
cd /project-root-folder
npm install
npm run build
```
3. Install Node PM2 and run server
```shell
sudo npm install pm2 -g
pm2 start npm --name app1 -- run start -- -p 3000
```
4. Install Nginx proxy
```shell
sudo apt install nginx -y
```
- setup config
```shell
cd /etc/nginx/sites-available
sudo vim default
```
Nginx 'default' config:
```conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name domain.com www.domain.com;

    listen 443 ssl; # managed by Certbot
    
    # RSA certificate
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem; # managed by Certbot
    
    # http to https redirect
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    # proxy domain.com to local server
    location / {
            proxy_pass             http://127.0.0.1:3000;
            proxy_read_timeout     60;
            proxy_connect_timeout  60;
            proxy_redirect         off;

            # Allow the use of websockets
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
    }
}
```
5. Restart
```shell
sudo systemctl restart nginx
```
```shell
sudo systemctl restart nginx
systemctl status nginx
```
