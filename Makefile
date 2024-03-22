init:
	[ -f .env ] || cp .env.example .env
	docker build -t e-motion-web .

run:
	docker compose up -d
shell:
	docker exec -it $$(docker ps --filter "ancestor=e-motion-web" -q) sh

clean:
	docker stop $$(docker ps -a --filter "ancestor=e-motion-web" -q)
	docker rm $$(docker ps -a --filter "ancestor=e-motion-web" -q)

remove-img:
	docker rmi e-motion-web

stop:
	docker stop $$(docker ps --filter "ancestor=e-motion-web" -q)

.PHONY: init run clean remove stop
