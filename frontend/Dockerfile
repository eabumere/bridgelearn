# # Stage 1: Build the Vite app
# FROM node:20 AS builder
# WORKDIR /app

# # Copy and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy the source code and build
# COPY . .
# RUN npm run build

# # Stage 2: Serve using Nginx
# FROM nginx:1.27-alpine
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Optional: custom Nginx config (useful for React Router/Vite)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

