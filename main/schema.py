from django.db.models import Count
import graphene
from graphene.contrib.django.filter import DjangoFilterConnectionField
from graphene.contrib.django.types import DjangoNode

from .models import Book, Category, Folder


class FolderNode(DjangoNode):

    full_url = graphene.String()

    class Meta:
        model = Folder


class CategoryNode(DjangoNode):

    children = graphene.List(graphene.LazyType(lambda _: CategoryNode))
    parent = graphene.Field(graphene.LazyType(lambda _: CategoryNode))
    has_books = graphene.Boolean()
    books_count = graphene.Int()

    def __init__(self, *args, **kwargs):
        self.facets = kwargs.pop('facets', None)
        super(CategoryNode, self).__init__(*args, **kwargs)

    def resolve_books_count(self, *args):
        facets = getattr(self, 'facets', None)
        if facets is None:
            return self.instance.books.count()
        else:
            return facets.get(self.instance.pk, 0)

    def resolve_children(self, *args):
        return [CategoryNode(cat, facets=self.facets) for cat in
                self.instance.get_children()]

    def resolve_parent(self, *args):
        return CategoryNode(self.instance.get_parent())

    def resolve_has_books(self, *args):
        return self.instance.books.exists()

    class Meta:
        model = Category


class BookNode(DjangoNode):

    book_cover = graphene.String()
    book_cover_full = graphene.String()
    pk = graphene.String()
    categories = graphene.List(CategoryNode)

    folders = graphene.List(FolderNode)
    full_url = graphene.String()

    def resolve_categories(self, *args):
        return [CategoryNode(cat) for cat in self.instance.categories.all()]

    def resolve_full_url(self, *args):
        return self.instance.full_url

    def resolve_folders(self, *args):
        return [FolderNode(f) for f in self.instance.folders.all()]

    def resolve_pk(self, *args):
        return self.instance.pk

    def resolve_book_cover(self, *args):
        """
        Return scaled thumb by default
        """
        try:
            return self.instance.cover_thumb.url
        except ValueError:
            pass

    def resolve_book_cover_full(self, *args):
        try:
            return self.instance.book_cover.url
        except ValueError:
            pass

    class Meta:
        model = Book
        filter_fields = ['categories']


class SearchResult(graphene.ObjectType):

    """
    Another dummy sub-root-node for searching
    """
    books = graphene.relay.ConnectionField(BookNode)
    root_category = graphene.Field(CategoryNode)


class Catalog(graphene.relay.Node):

    """
    Dummy root-node class
    """
    all_books = DjangoFilterConnectionField(BookNode)
    bookNode = graphene.relay.NodeField(BookNode)
    root_category = graphene.Field(CategoryNode)
    search_result = graphene.Field(
        SearchResult,
        search_text=graphene.String().NonNull
    )
    id = None

    def resolve_search_result(self, args, info):
        search_text = args.get('search_text')
        qs = Book.full_text_search.ranked_search(search_text)
        books = [BookNode(b) for b in qs]
        facets = {
            record['category']: record['facet'] for record in
            qs.order_by('category')
            .values('category')
            .annotate(facet=Count('pk'))
        }
        root_category = CategoryNode(Category.objects.first(), facets=facets)
        return SearchResult(books=books, root_category=root_category)

    def resolve_root_category(self, *args):
        return CategoryNode(Category.objects.first())

    @classmethod
    def get_node(cls, id, info):
        return cls()


class Query(graphene.ObjectType):

    catalog = graphene.Field(Catalog)
    node = graphene.relay.NodeField()

    def resolve_catalog(self, *args):
        return Catalog()

    class Meta:
        abstract = True
