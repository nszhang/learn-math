#!/usr/bin/env bash
# Deploy MathAce to webapp01 → https://math.pnpsolutions.ca/learn-math/
#
# Production layout (webapp01.pnpsolutions.ca):
#   /var/www/learn-math/                  app (this repo; built on server)
#   /var/www/learn-math/server/.env     DATABASE_URL only (backup script reads it; NOT in git)
#   /etc/learn-math.env                 root:600 — DATABASE_URL, JWT_SECRET, PORT=3006
#   systemd: learn-math.service         Express serves API + built client on 127.0.0.1:3006
#   nginx:   /etc/nginx/conf.d/math.pnpsolutions.ca.conf
#            location /learn-math/{,/api/} → proxy to :3006 (prefix stripped)
set -euo pipefail
HOST=nzhang@webapp01.pnpsolutions.ca
APP=/var/www/learn-math

rsync -a --delete \
  --exclude .git \
  --exclude node_modules \
  --exclude client/dist \
  --exclude server/.env \
  ./ "$HOST:$APP/"

ssh "$HOST" "set -e
  cd $APP
  npm --prefix server ci --omit=dev
  npm --prefix client ci
  npm --prefix client run build
  sudo systemctl restart learn-math
  sleep 2
  systemctl is-active learn-math
  curl -sf http://127.0.0.1:3006/api/health
"
echo
echo "✅ Deployed: https://math.pnpsolutions.ca/learn-math/"
