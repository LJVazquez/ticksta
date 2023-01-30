FROM node:latest

WORKDIR /back

COPY ./ ./

RUN npm install

EXPOSE 3001:3001

CMD ["npm", "run", "prodStart"] 