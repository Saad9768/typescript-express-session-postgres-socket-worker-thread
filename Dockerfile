FROM node as base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# If you are building your code for production
RUN npm i

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 4500

CMD [ "npm", "start" ]