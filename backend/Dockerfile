FROM node:18
# Installing libvips-dev for sharp Compatibility
RUN apt-get update && apt-get install -y build-essential libvips-dev git python3
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH /opt/app/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN npm rebuild better-sqlite3
RUN chown -R node:node /opt/app
USER node
RUN ["npm", "run", "build"]
EXPOSE 1337
CMD ["npm", "run", "develop"]
