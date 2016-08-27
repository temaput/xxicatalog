from django.core.management.base import BaseCommand, CommandError
from xml.etree import ElementTree as etree
from os import path
from ._load_fixture import iter_tree


class Command(BaseCommand):

    help = 'Loads initial data about catalogue from xml'

    def add_arguments(self, parser):
        parser.add_argument("fixture", help="Fixture xml file")

    def handle(self, *args, **options):
        fixture = options['fixture']
        if path.exists(fixture):
            pass
        else:
            raise CommandError('Fixture file %s does not exist' % fixture)
