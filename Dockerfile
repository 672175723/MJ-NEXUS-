# Use Node.js 20+ for native TypeScript support
FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose the port (3000 is default for this app)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
