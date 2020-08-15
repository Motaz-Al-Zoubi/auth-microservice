FROM node:12.4.0 AS deps
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ARG PORT
ENV PORT $PORT
WORKDIR /var/code
COPY package.json .
RUN npm install
ADD . /var/code

FROM node:12.4.0
WORKDIR /var/code
RUN apt-get update && apt-get install -y vim
COPY --from=deps /var/code /var/code
RUN chmod +x ./src/server.js
RUN echo "NODE_ENV IS $NODE_ENV"
RUN echo "PORT IS $PORT"
EXPOSE $PORT
CMD ["node", "./src/server.js"]
