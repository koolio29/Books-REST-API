FROM node:16-alpine3.15
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]
