FROM node:lts
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV production
ENV GENERATE_SOURCEMAP false

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]