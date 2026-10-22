#!/usr/bin/env bash
# Deploy LearnAce (formerly MathAce) to webapp01 → https://learn.pnpsolutions.ca/learnace/
#
# Production layout (webapp01.pnpsolutions.ca):
#   /var/www/learn-math/                  app (this repo; built on server)
#   /var/www/learn-math/server/.env     DATABASE_URL only (backup script reads it; NOT in git)
#   /etc/learn-math.env                 root:600 — DATABASE_URL, JWT_SECRET, PORT=3006
#   systemd: learn-math.service         Express serves API + built client on 127.0.0.1:3006
#   nginx:   /etc/nginx/conf.d/learn.pnpsolutions.ca.conf
#            location /learnace/ → proxy to :3006 (prefix stripped)
#            math.pnpsolutions.ca/learn-math/* → 301 to learn.pnpsolutions.ca/learnace/* (API: 308)
set -euo pipefail
HOST="${DEPLOY_HOST:-webapp01.pnpsolutions.ca}"
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
echo "✅ Deployed: https://learn.pnpsolutions.ca/learnace/"
