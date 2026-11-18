FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
ENV AUTH_DIR=/data/auth
RUN mkdir -p /data/auth && chown -R node:node /data
VOLUME /data
USER node
CMD ["node", "src/index.js"]
