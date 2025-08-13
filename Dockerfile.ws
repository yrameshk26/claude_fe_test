FROM node:23-alpine

WORKDIR /app

COPY ws-server/package.json ./package.json
RUN npm install --omit=dev --ignore-scripts

COPY .env.example .env

COPY ws-server/ws-server.js ./

CMD ["node", "ws-server.js"]
