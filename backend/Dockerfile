# backend/Dockerfile
FROM node:20-alpine
WORKDIR /workspace
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]