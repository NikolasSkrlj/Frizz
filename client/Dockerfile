FROM node:14 AS Production

ENV NODE_ENV=production
ENV REACT_APP_API_URL=http://localhost:4000

WORKDIR /usr/src/client

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build --output-path=/usr/src/client/build

CMD ["sh", "-c", "npm run start"]