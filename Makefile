# Step 3: Build the Docker image
init:
	docker build -t e-motion-web .
	docker run -it e-motion-web /bin/sh
	vue
	vue create e-motion-web

# Step 6: Move code outside the container
move-code:
	# Outside container
	docker ps
	docker cp e-motion-web:/usr/src/app/e-motion-web .
	docker exec e-motion-web rm -rf e-motion-web
	docker volume create e-motion-web-volume

# Step 8: Run container and access project
run-with-volume:
	docker run -it -p 8080:8080 -v ~/Documents/Projects/e-motion/e-motion-web:/usr/src/app/e-motion-web/. e-motion-web

# Phony targets
.PHONY: install-docker create-folder-dockerfile build-image run-container check-create-project move-code create-volume run-with-volume init
