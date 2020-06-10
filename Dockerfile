FROM nginx:alpine
MAINTAINER Valentin DEVILLE <contact@valentin-deville.eu>

EXPOSE 80

COPY ./assets/ /data/wouaf-website/assets/
COPY ./favicon.ico /data/wouaf-website/
COPY ./index.html /data/wouaf-website/
COPY ./wouafwouaf.cache /data/wouaf-website/
COPY ./Docker/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
