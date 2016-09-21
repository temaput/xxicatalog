export DJANGO_SETTINGS_MODULE=xxicatalog.settings.production
export NODE_ENV=production
docker-compose down
dcproduction="docker-compose -f docker-compose.yml -f docker-compose-production.yml"
$dcproduction run web python manage.py collectstatic
