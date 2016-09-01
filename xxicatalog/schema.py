import graphene

from main.schema import Query


class Query(Query):
    pass

schema = graphene.Schema(name="Catalog Schema", query=Query)
