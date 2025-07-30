FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY start-nginx.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/start-nginx.sh