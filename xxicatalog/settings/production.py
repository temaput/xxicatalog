from os.path import join
from .base import *
from .local_settings import SECRET_KEY, DB_PASSWORD

DEBUG = False
ALLOWED_HOSTS = ['localhost', 'catalog.classica21.ru']
DEFAULT_FROM_EMAIL = 'info@classica21.ru'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': DB_PASSWORD,
        'HOST': 'db',
        'PORT': 5432,

    }
}

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# STATIC_ROOT is to collect static offline in deploy
STATIC_ROOT = join(BASE_DIR, 'nginx', 'static')

# MEDIA_ROOT is to collect media online
MEDIA_ROOT = '/data/media'
