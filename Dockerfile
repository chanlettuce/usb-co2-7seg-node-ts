FROM node:14

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY src src

CMD [ "yarn", "start" ]
