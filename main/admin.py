from django.contrib import admin

# Register your models here.
from .models import Book, Category
admin.site.register(Category)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_filter = ('category',)
    ordering = ('title',)
    search_fields = ('title', 'subtitle', 'author')

    class Media:
        js = (
            '//cdn.tinymce.com/4/tinymce.min.js',
            "tinymce_init.js"
        )
