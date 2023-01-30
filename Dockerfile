FROM node:latest

WORKDIR /back

COPY ./back ./

RUN npm install

EXPOSE 3001:3001

CMD ["npm", "run", "prodStart"] 