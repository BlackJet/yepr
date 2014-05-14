# coding=utf-8

import logging
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Drop all database tables, make syncdb and load all fixtures.'

    def handle(self, *args, **options):
        # Что бы не выводились sql запросы, а то их дофигище
        logger = logging.getLogger('django.db.backends')
        logger.disabled = True

        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("drop schema if exists public cascade; create schema public;")
        self.stdout.write('Database schema recreated.')

        self.stdout.write('Call syncdb...')
        # interactive=false чтобы не спрашивало о создании супер пользователя, он создатся при импорте initial_data.json
        call_command('syncdb', interactive=False)
        self.stdout.write('Syncdb finished.')

        self.stdout.write('Load fixtures.')
        call_command('loaddata', 'categories')