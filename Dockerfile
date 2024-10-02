FROM node:22-slim

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 8888

CMD ["npm", "run", "serve"]