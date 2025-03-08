# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /gke-file-gateway

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally (needed for compilation)
RUN npm install -g typescript

# Copy the rest of the application code into the container
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Expose the port the app will run on
EXPOSE 6000

# Command to run your app after compiling TypeScript
CMD ["node", "dist/index.js"]
