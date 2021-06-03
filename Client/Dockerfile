FROM node

WORKDIR /usr/src/smart-notes/client
COPY package.json /usr/src/smart-notes/client
COPY package-lock.json /usr/src/smart-notes/client

RUN npm install --legacy-peer-deps
RUN npm i react-scripts
RUN yarn install

COPY . /usr/src/smart-notes/client
# ENV DEBUG=*
EXPOSE 3000
CMD ["yarn", "start"]