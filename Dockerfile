FROM node:20.11-alpine

ENV NODE_ENV development

EXPOSE 5000

RUN npm set registry https://registry.npmjs.org
RUN npm set @lwt-common:registry=http://npm-repo.lab.lwolf.com
RUN npm set @lwt-helix:registry=http://npm-repo.lab.lwolf.com
RUN npm set @helix:registry=http://npm-repo.lab.lwolf.com
RUN npm set @types:registry=http://npm-repo.lab.lwolf.com
RUN npm set @terradatum:registry=http://npm-repo.lab.lwolf.com
RUN npm install -g serve@14.2.1

RUN mkdir -p /usr/app/source
ADD . /usr/app/source

# to avoid issue if path is same as target
RUN cp /usr/app/source/config/serve.json /usr/app/serve.json

WORKDIR /usr/app/source

RUN npm install
RUN npm run test-cvg-jenkins

ENV NODE_ENV production

RUN rm -fr node_modules
RUN npm install
RUN npm run build

WORKDIR /usr/app

RUN mv /usr/app/source/public /usr/app/public && \
    rm -rf /usr/app/source

CMD serve -s -p 5000 -c /usr/app/serve.json /usr/app/public
