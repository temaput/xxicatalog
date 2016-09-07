from django.contrib import admin

# Register your models here.
from .models import Book, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    filter_horizontal = ('books',)
    fields = ('title',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_filter = ('categories',)
    ordering = ('title',)
    search_fields = ('title', 'subtitle', 'author')
    filter_horizontal = ('categories',)
    exclude = ('annotation', 'book_id',)

    class Media:
        js = (
            '//cdn.tinymce.com/4/tinymce.min.js',
            "js/tinymce_init.js"
        )
