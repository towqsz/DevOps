FROM node:alpine

# wszystko co instalujemy będzie lądować w tym katalogu. Bez tego w katalogu głowynym
WORKDIR /opt/app

COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "start"]