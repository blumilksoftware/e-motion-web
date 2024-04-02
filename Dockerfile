# Use the official Node.js 20 image with Alpine Linux as base
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app/e-motion-web

# Install Vue CLI globally

# Copy package.json and package-lock.json (if exists) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose port 80 internally
EXPOSE 80

# Start the application
CMD ["npm", "run", "serve"]
