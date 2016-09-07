import os
from django.db import models
from django.conf import settings

from django.contrib.postgres.search import (
    SearchVector, SearchQuery, SearchRank
)
from functools import reduce
from treebeard.mp_tree import MP_Node

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFit

# Create your models here.


def full_text_search(qs, search_text, fields_tuple):
    """Runs postgres full text search

    :search_text: string
    :fields_tuple: tuple aka ((fname, weight),)
    :qs: initional qs
    :returns: qs with search applied, sorted by rank

    """

    sq = SearchQuery(search_text)
    svectors = (
        SearchVector(fname, weight=weight) for fname, weight in fields_tuple
    )
    return qs.annotate(
        rank=SearchRank(reduce(lambda a, b: a + b, svectors), sq)
    ).filter(rank__gte=0.3).order_by('-rank')


class FullTextSearchQS(models.QuerySet):
    """Custom qs to make full text search with postgres"""

    def ranked_search(self, search_text):
        fields_tuple = (
            ('title', 'A'),
            ('subtitle', 'A'),
            ('author', 'A'),
            ('book_description', 'B'),
        )
        return full_text_search(self, search_text, fields_tuple)


class Category(MP_Node):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Рубрика'
        verbose_name_plural = 'Рубрики'


class Book(models.Model):
    title = models.CharField(
        "Заголовок",
        max_length=255
    )
    subtitle = models.CharField(
        "Подзаголовок",
        max_length=512,
        blank=True
    )

    author = models.CharField(
        "Автор / Составитель / Автор-составитель",
        max_length=255,
        blank=True
    )

    book_format = models.CharField(
        "Формат",
        max_length=255,
        blank=True
    )

    book_edition = models.CharField(
        "Сведения об издании",
        max_length=100,
        blank=True
    )

    book_translator = models.CharField(
        "Переводчик",
        max_length=100,
        blank=True
    )

    book_translation = models.CharField(
        "Данные о переводе",
        max_length=100,
        blank=True
    )

    price = models.DecimalField(
        "Цена",
        max_digits=15,
        decimal_places=2,
        blank=True,
        null=True
    )

    article = models.CharField(
        "Артикул",
        max_length=5,
        blank=True
    )

    book_description = models.TextField(
        "Аннотация по сайту",
        blank=True

    )

    book_cover = models.ImageField(
        "Фото обложки",
        blank=True,
        upload_to='book_covers'
    )
    cover_thumb = ImageSpecField(
        source='book_cover',
        processors=[
            ResizeToFit(settings.CATALOG_COVER_THUMB_WIDTH, upscale=False)
        ],
        format='JPEG',
        options={'quality': 100}
    )
    book_id = models.PositiveIntegerField(
        "Идентификатор книги на сайте",
        blank=True,
        null=True
    )

    categories = models.ManyToManyField(
        'main.Category',
        verbose_name="Рубрики",
        related_name="books",
        blank=True
    )

    objects = models.Manager()
    full_text_search = FullTextSearchQS.as_manager()

    @property
    def full_url(self):
        classica_site = settings.CLASSICA_SITE_URL
        bid = str(self.book_id)
        if self.folders.exists():
            folder_url = self.folders.first().full_url
            return os.path.join(folder_url, bid)
        else:
            return os.path.join(classica_site, bid)

    def __str__(self):
        return "%s %s (%s)" % (self.title, self.subtitle, self.author)

    class Meta:
        verbose_name = 'Издание'
        verbose_name_plural = 'Издания'
        ordering = ('title', 'subtitle', 'author')


class Folder(models.Model):
    title = models.CharField(
        "Название рубрики на сайте",
        max_length=255
    )
    url = models.CharField(
        "Адрес рубрики на сайте",
        max_length=100
    )
    books = models.ManyToManyField(Book, "folders")

    @property
    def full_url(self):
        classica_site = settings.CLASSICA_SITE_URL
        return os.path.join(classica_site, self.url)

    def __str__(self):
        return "Папка на сайте %s" % self.title
