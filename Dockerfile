# Use the Node.js 20 Alpine image as the base image
FROM node:20-alpine

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app/e-motion-web

# Install the Vue CLI globally in the container
RUN npm install -g @vue/cli

# Create a volume for the node_modules directory
VOLUME /usr/src/app/e-motion-web/node_modules

# Install the project dependencies
COPY package*.json ./
RUN npm install

# Expose port 8080 for the development server
EXPOSE 8080

# Start the development server when the container starts
CMD ["npm", "run", "serve"]
