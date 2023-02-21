FROM node:16-alpine as builder

WORKDIR /app
RUN mkdir -p apps/api apps/client libs/api-interface
COPY package.json yarn.lock /app/
COPY apps/api/package.json /app/apps/api/
COPY apps/client/package.json /app/apps/client/
COPY libs/api-interface/package.json /app/libs/api-interface/
RUN yarn install --frozen-lockfile
# COPY libs /app/libs
# RUN yarn install --frozen-lockfile
# COPY apps /app/apps
COPY . .
RUN yarn build

FROM node:16-alpine

RUN yarn global add concurrently

WORKDIR /app
RUN mkdir -p apps/api apps/client libs/api-interface
COPY package.json yarn.lock /app/
COPY apps/api/package.json /app/apps/api/
COPY apps/client/package.json /app/apps/client/
COPY libs/api-interface/package.json /app/libs/api-interface/
RUN yarn install --frozen-lockfile --production
# COPY libs /app/libs
# RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/libs/api-interface/dist/ /app/libs/api-interface/dist/
COPY --from=builder /app/apps/api/dist/ /app/apps/api
COPY --from=builder /app/apps/client/.next/standalone/. /app/apps/client/.
COPY --from=builder /app/apps/client/.next/static/. /app/apps/client/.next/static/.
COPY --from=builder /app/apps/client/public/. /app/apps/client/public/.

EXPOSE 3000

CMD ["concurrently", "node apps/api/main.js", "node apps/client/server.js"]