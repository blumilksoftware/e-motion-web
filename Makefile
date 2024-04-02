init:
	[ -f .env ] || cp .env.example .env
	make run

run:
	docker compose up -d

shell:
	docker exec -it e-motion-web sh

img-clean:
	docker rmi e-motion-web

stop:
	docker compose down

prune:
	make stop
	docker system prune -a

.PHONY: init run shell img-clean stop prune
