#!/bin/bash
cd backend && tsc && cd ../frontend && npm run build && cd ..
zip -r bs-frontend.zip ./frontend/build/
zip -r bs-backend.zip ./backend/
scp bs-frontend.zip bs-backend.zip local@141.45.146.200:/home/local/
ssh local@141.45.146.200 'unzip -o bs-backend.zip; unzip -o bs-frontend.zip; rm -r /var/www/html/*; cp -R frontend/build/. /var/www/html/; cp .env ./backend/; cp ecosystem.config.js ./backend/ecosystem.config.js; pm2 restart backend'
rm bs-frontend.zip bs-backend.zip
echo "deployed files to the server at: 141.45.146.200"