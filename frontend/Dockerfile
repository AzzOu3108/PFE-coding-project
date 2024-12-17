# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port for the frontend (Vite default is 3000)
EXPOSE 3000

# Start the app using npm (this starts Vite's development server)
CMD ["npm", "run", "dev"]
