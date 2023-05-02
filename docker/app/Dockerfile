FROM node:lts

ENV NODE_ENV production
ENV GENERATE_SOURCEMAP false

VOLUME ["/app"]

WORKDIR /app/server
CMD ["yarn", "start"]

WORKDIR /app/client
CMD ["yarn", "start"]

EXPOSE 3000
EXPOSE 3001