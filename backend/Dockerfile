# Use Node.js Alpine base image
FROM node:20.16.0-alpine

# Set environment to development
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Nodemon globally
RUN npm install -g nodemon

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 8000

# Start the backend server with Nodemon
CMD ["nodemon", "server.js"]
