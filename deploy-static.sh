export DJANGO_SETTINGS_MODULE=xxicatalog.settings.production
export NODE_ENV=production
docker-compose run web python manage.py collectstatic
cd client
npm run deploy-static
