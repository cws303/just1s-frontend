FROM node:lts-alpine as build-stage

WORKDIR /app

# ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
# RUN npm run start

FROM nginx:stable-alpine
# # COPY ./default.conf /etc/nginx/nginx.conf/.conf
# COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx"]

# FROM nginx:1.16.0-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY default.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# start app

# CMD ["npm", "run", "start"]


# FROM node:lts-alpine as build

# WORKDIR /app

# ENV PATH /app/node_modules/.bin:$PATH

# COPY package.json /app/package.json
# RUN npm install
# RUN npm install @vue/cli -g

# COPY . .

# RUN npm run build
# # RUN npm run start


# FROM nginx:1.16.0-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY default.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# # start app

# # CMD ["npm", "run", "start"]
