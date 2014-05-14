# coding=utf-8

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    #('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'yep',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

import os

PROJECT_ROOT = os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir))

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.4/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

TIME_ZONE = 'Europe/Moscow'

LANGUAGE_CODE = 'ru-RU'

USE_I18N = True

USE_L10N = True

USE_TZ = True

MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')

MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    # os.path.join(PROJECT_ROOT, 'static'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'h89y4h4(&amp;_u2(=2$)r^03*0d2clngcfnk!l1_db-4@c@yck24a'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware'
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'yep.urls'

WSGI_APPLICATION = 'yep.wsgi.application'


TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), '..', 'templates').replace('\\','/'),)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mptt',  # https://github.com/django-mptt/django-mptt/
    'tastypie',
    'core',
    'photo',
    'trash'  # Приложение для всякого тестового мусора
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG'
        }
    }
}


try:
    from settings_local import *
except ImportError:
    pass