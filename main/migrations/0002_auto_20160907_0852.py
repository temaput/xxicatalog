# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-07 08:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='book_format',
            field=models.CharField(blank=True, max_length=255, verbose_name='Формат'),
        ),
    ]