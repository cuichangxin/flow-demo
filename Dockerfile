FROM nginx:latest
EXPOSE 16380
COPY ./dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf