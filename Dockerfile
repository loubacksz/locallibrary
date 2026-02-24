# I want a simple Dockerfile to run this app, nothing complex
# 1 - Define base image ✅ - node:lts
# 2 - App dependecies ✅
# 3 - Copy source code ✅
# 4 - Configure final image ✅

# Base Image 
FROM node:lts
# Working directory
WORKDIR /usr/app

# Installing dependencies
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json
RUN npm ci

COPY . /usr/app

EXPOSE 4000

CMD ["node", "./bin/www"]