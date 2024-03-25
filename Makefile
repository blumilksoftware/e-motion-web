init:
	[ -f .env ] || cp .env.example .env
	docker build -t e-motion-web .

run:
	docker compose up -d
shell:
	docker exec -it $$(docker ps --filter "ancestor=e-motion-web" -q) sh

remove-img:
	docker rmi e-motion-web

stop:
	docker compose down

prune:
	make stop
	docker system prune -a

.PHONY: init run shell remove-img stop prune
