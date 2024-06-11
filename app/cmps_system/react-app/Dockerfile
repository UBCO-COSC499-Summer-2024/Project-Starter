# Build the React app
FROM node:22-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

# For some reason this was never working when ran here so I put it in the docker-compose file instead
# RUN npm run build 

# The build output will be in /app/build
