# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Your backend port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
