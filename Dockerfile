FROM node as build
WORKDIR /app
COPY . /app
RUN npm install

FROM node:16-alpine3.15
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "start"]
