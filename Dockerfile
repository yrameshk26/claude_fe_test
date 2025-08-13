FROM node:23-alpine AS build

ARG VCS_REF
LABEL org.label-schema.vcs-ref=$VCS_REF

# install dependencies
WORKDIR /app
COPY package.json ./
RUN npm i --ignore-scripts

# Copy all local files into the image.
COPY . .

# Build the dependencies
COPY .env.example .env
RUN npm run build
RUN rm -rf node_modules
RUN npm install --omit=dev --ignore-scripts

# Copy the build output to the image
FROM node:23-alpine

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/
COPY --from=build /app/build/ /app/

WORKDIR /app

# set timezone
RUN apk add --no-cache tzdata
ENV TZ="America/Toronto"

CMD ["node", "index.js"]