from .base import *
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'WARNING',
            'handlers': ['console'],
        },
        'main.models': {
            'level': 'DEBUG',
            'handlers': ['console'],
        }
    }
}
