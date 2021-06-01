FROM node

WORKDIR /usr/src/smart-notes/server

COPY package*.json /usr/src/smart-notes/server

RUN npm ci

COPY . /usr/src/smart-notes/server

EXPOSE 5000

CMD [ "npm", "start" ]