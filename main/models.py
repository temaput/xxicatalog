from django.db import models
from treebeard.mp_tree import MP_Node

# Create your models here.


class Category(MP_Node):
    title = models.CharField(max_length=255)

    def __str__(self):
        return 'Рубрика %s' % self.title


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
        max_length=15,
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

    category = models.ForeignKey(
        Category,
        related_name='books',
        verbose_name='Рубрика'
    )

    def __str__(self):
        return "%s. %s" % (self.title, self.subtitle)


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

    def __str__(self):
        return "Папка на сайте %s" % self.title
