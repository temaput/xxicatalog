import os
import re
from functools import reduce
from django.db import models
from django.conf import settings
from django.core.cache import cache as default_cache
from django.apps import apps
from django.db.models.functions import Concat

from django.contrib.postgres.search import (
    SearchVector, SearchQuery, SearchRank, TrigramSimilarity,
)
from treebeard.mp_tree import MP_Node

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFit

from logging import getLogger
log = getLogger(__name__)

# Create your models here.

mainAppConfig = apps.get_app_config('main')

ONLY_WORDS_PATTERN = r'\w{3,}'


def cached_keywords():
    cache_key = 'CATALOG_CATEGORY_KEYWORDS_CACHE'
    keywords = default_cache.get(cache_key)
    if keywords is None:
        log.debug("Compiling keywords...")
        qs = mainAppConfig.get_model('Category').objects.all().values('title')
        titles = ' '.join([cat['title'] for cat in qs])
        word_list = re.findall(ONLY_WORDS_PATTERN, titles)
        keywords = set(word_list)
        default_cache.set(cache_key, keywords, None)
    return keywords


def sum_vectors(vectors_tuple):
    return reduce(lambda a, b: a + b, vectors_tuple)


def full_text_search(qs, search_text, fields_tuple, threshold,
                     use_keywords=True):
    """Runs postgres full text search

    :search_text: string
    :fields_tuple: tuple aka ((fname, weight),)
    :qs: initional qs
    :returns: qs with search applied, sorted by rank

    """
    sq = SearchQuery(search_text)
    svectors = sum_vectors(
        SearchVector(fname, weight=weight) for fname, weight in fields_tuple
    )
    if use_keywords:
        keywords = cached_keywords()
        word_list = set(re.findall(ONLY_WORDS_PATTERN, search_text))
        intersection = keywords.intersection(word_list)
        if intersection:
            log.debug("Keywords search got intersection: %s", intersection)
            refined_qs = qs.annotate(
                keywords_search=svectors).filter(
                    keywords_search=' '.join(intersection))
            log.debug("Refined qs is %s elements long", qs.count())
            qs = refined_qs if refined_qs.exists() else qs

    return qs.annotate(rank=SearchRank(svectors, sq)).filter(
        rank__gte=threshold)


def trigram_search(qs, search_text, fields_tuple, threshold):
    fields = Concat(*fields_tuple) if len(fields_tuple) > 1 \
        else fields_tuple[0]
    ts = TrigramSimilarity(fields, search_text)
    return qs.annotate(similarity=ts).filter(similarity__gte=threshold)


class Category(MP_Node):

    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Рубрика'
        verbose_name_plural = 'Рубрики'


class FullTextSearchQS(models.QuerySet):
    """Custom qs to make full text search with postgres"""

    def ranked_search(self, search_text, fields_tuple=(),
                      threshold=settings.CATALOG_SEARCH_RANK_THRESHOLD,
                      use_keywords=True):
        fields_tuple = fields_tuple or (
            ('title', 'A'),
            ('subtitle', 'A'),
            ('author', 'A'),
            ('book_description', 'B'),
        )
        return full_text_search(self, search_text, fields_tuple, threshold,
                                use_keywords)

    def autocomplete_search(self, search_text, fields_tuple=(),
                            threshold=settings.CATALOG_AUTOCOMPLETE_THRESHOLD):
        fields_tuple = fields_tuple or ('title', 'subtitle')
        return trigram_search(self, search_text, fields_tuple, threshold)


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
