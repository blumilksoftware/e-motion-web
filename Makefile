init:
	docker build -t e-motion-web .

run:
	docker run -it -p 8080:8080 -v .:/usr/src/app/e-motion-web e-motion-web -d

clean:
	docker stop $$(docker ps -a --filter "ancestor=e-motion-web" -q)
	docker rm $$(docker ps -a --filter "ancestor=e-motion-web" -q)

remove-img:
	docker rmi e-motion-web

stop:
	docker stop $$(docker ps --filter "ancestor=e-motion-web" -q)

# Phony targets
.PHONY: init run clean remove stop
