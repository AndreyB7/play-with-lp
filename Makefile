build-image-game:
	docker build --no-cache -t game-app ./docker/app

build-image-nginx:
	docker build --no-cache -t nginx ./docker/nginx

install-deps:
	docker run -v ./:/app game-app yarn install --frozen-lockfile

build-game:
	docker run -v ./:/app game-app yarn run build

start:
	docker compose up -d
