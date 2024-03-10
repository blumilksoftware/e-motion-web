# Use the Node.js 20 Alpine image as the base image
FROM node:20-alpine

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app/e-motion-web

# Install the Vue CLI globally in the container
RUN npm install -g @vue/cli

# Expose port 8080 for the development server
EXPOSE 8080

# Start the development server when the container starts
CMD ["npm", "run", "serve"]