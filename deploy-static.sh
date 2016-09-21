export DJANGO_SETTINGS_MODULE=xxicatalog.settings.production
export NODE_ENV=production
docker-compose down
dc-production=docker-compose -f docker-compose.yml -f docker-compose-production.yml
dc-production run web python manage.py collectstatic
cd client
npm run deploy-static
