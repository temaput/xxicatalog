from django.core.management.base import BaseCommand, CommandError
from xml.etree import ElementTree as etree
from os import path
from ._load_fixture import iter_tree, add_book

from main.models import Category, Book, Folder


class Command(BaseCommand):

    help = 'Loads initial data about catalogue from xml'

    def add_arguments(self, parser):
        parser.add_argument("fixture", help="Fixture xml file")

    def handle(self, *args, **options):
        fixture = options['fixture']
        if path.exists(fixture):
            root_el = etree.parse(fixture).getroot()
            self.cleanup()
            root_record = Category.add_root(title='Каталог')
            root_record = Category.objects.get(pk=root_record.pk)
            iter_tree(root_el, root_record, add_book)
        else:
            raise CommandError('Fixture file %s does not exist' % fixture)

    def cleanup(self):
        for m in (Category, Book, Folder):
            for instance in m.objects.all():
                instance.delete()
