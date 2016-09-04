import os
from django.db import models
from django.conf import settings
from treebeard.mp_tree import MP_Node

# Create your models here.


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
        "Автор по каталогу",
        max_length=255,
        blank=True

    )
    city = models.CharField(
        "Город",
        max_length=15,
        blank=True
    )
    publisher = models.CharField(
        "Издательство",
        max_length=128,
        blank=True
    )
    page_amount = models.CharField(
        "Количество страниц",
        max_length=50,
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
    annotation = models.TextField(
        "Аннотация по каталогу (из базы)",
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
    book_id = models.PositiveIntegerField(
        "Идентификатор книги на сайте",
        blank=True,
        null=True
    )

    category = models.ForeignKey(
        Category,
        related_name='books',
        verbose_name='Рубрика'
    )

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
        return "%s. %s (%s)" % (self.title, self.subtitle, self.author)

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
