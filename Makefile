# Step 1: Build the Docker image
init:
	docker build -t e-motion-web .

# Step 2: Run the Docker container
run:
	docker run -it -p 8080:8080 -v .:/usr/src/app/e-motion-web e-motion-web
# Phony targets
.PHONY: init run
