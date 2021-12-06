FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 3005
CMD ["npm", "start"]