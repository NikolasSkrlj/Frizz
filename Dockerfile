FROM node:14 AS Production

ENV NODE_ENV=production
ENV MONGO_URI=mongodb+srv://Nikolas:nikolas123@cluster0-vkrfv.mongodb.net/saloni?retryWrites=true&w=majority
ENV JWT_SECRET=sh3r7shdshd7237gd

WORKDIR /usr/src/api

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm run start-prod"]