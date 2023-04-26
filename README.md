## The Game

### Run app in docker environment
1. Install docker and docker compose.
2. Build images:
    ```shell
    $ docker build --no-cache -t game-app ./docker/app
    $ docker build --no-cache -t nginx ./docker/nginx
    ```
3. Install dependencies and build NEXT JS application:
    ```shell
    $ docker run -v ./:/app game-app yarn install --frozen-lockfile
    $ docker run -v ./:/app game-app yarn run build
    ```
4. Replace all strings _DOMAIN_ to your domain name in _configs/site.conf_:
    ```shell
    $ sed -i 's/DOMAIN1/docker-lap.dev.lcl/g' configs/site.conf
    ```
5. Configure volume with certs files in _docker-compose.yml_:
    ```yaml
   # docker-compose.yml
        volumes:
          - <PATH_TO_DIRECTORY_WITH_YOUR_CERTS>:/etc/nginx/certs
    ```
6. Create _.env_ file:
    ```shell
    $ echo 'PASSWORD=password' > .env
    ```
7. Run app:
    ```shell
    $ sudo docker compose up -d
    ```