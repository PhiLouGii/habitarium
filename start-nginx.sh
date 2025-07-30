#!/bin/sh
# Wait for backend and frontend to be ready
sleep 20
exec nginx -g 'daemon off;'