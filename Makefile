build:
	docker build --no-cache -t web .

start:
	docker compose up -d
