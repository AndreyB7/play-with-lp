build:
	docker build --no-cache -t web .

build-nginx:
	docker build --no-cache -t nginx ./nginx

start:
	docker compose up -d
