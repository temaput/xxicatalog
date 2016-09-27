from django.contrib import admin
from django.utils.html import format_html
from treebeard_admin.admin import TreeAdmin
from treebeard.forms import movenodeform_factory


# Register your models here.
from .models import Book, Category


@admin.register(Category)
class CategoryAdmin(TreeAdmin):
    form = movenodeform_factory(Category)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_filter = ('categories',)
    list_display = ('__str__', 'html_book_description',)
    ordering = ('title',)
    search_fields = ('title', 'subtitle', 'author')
    filter_horizontal = ('categories',)
    exclude = ('book_id', 'book_translation', 'book_translator')

    def html_book_description(self, obj):
        return format_html(obj.book_description)
    html_book_description.short_description = "Аннотация"

    class Media:
        js = (
            '//cdn.tinymce.com/4/tinymce.min.js',
            "js/tinymce_init.js"
        )
