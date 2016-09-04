DJANGO_SETTINGS_MODULE=xxicatalog.settings.production
docker-compose run web python manage.py collectstatic
cd client
npm run deploy-static
