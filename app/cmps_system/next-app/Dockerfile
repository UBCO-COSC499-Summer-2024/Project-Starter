# Dockerfile.dev

FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Command to run the Next.js development server
CMD ["npm", "run", "build"]
