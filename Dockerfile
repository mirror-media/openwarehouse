# https://docs.docker.com/samples/library/node/
ARG NODE_VERSION=12.18.2
# https://github.com/Yelp/dumb-init/releases
ARG DUMB_INIT_VERSION=1.2.2

# Build container
FROM node:${NODE_VERSION}-alpine AS build
ARG DUMB_INIT_VERSION
WORKDIR /build

RUN apk add --no-cache build-base python2 yarn && \
    wget -O dumb-init -q https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT_VERSION}/dumb-init_${DUMB_INIT_VERSION}_amd64 && \
    chmod +x dumb-init
ADD . /build
RUN mkdir tmp_pic
RUN yarn install
RUN yarn build && yarn cache clean
RUN yarn migrate

# remove any dummy configs from build time
RUN rm -rf configs

# Runtime container
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
COPY ./public /build/public
COPY --from=build /build /app

# add sharp again to build the dependency in this stage
RUN yarn add sharp

EXPOSE 3000
CMD ["./dumb-init", "yarn", "start"]
