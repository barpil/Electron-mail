#!/bin/sh
echo "------------------------------------------------"
echo "Angular Frontend is starting on port: 8443 SSL"
echo "Proxy to backend: $BACKEND_HOST:$BACKEND_PORT"
echo "------------------------------------------------"

exec nginx -g "daemon off;"