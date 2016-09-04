from main.models import Category, Book, Folder
from urllib import request
from os.path import join
from os import makedirs
import sys
from django.conf import settings
from urllib.error import URLError, HTTPError
import socket

socket.setdefaulttimeout(30.0)


def iter_tree(root_el, group_record, book_routine):
    for el in root_el:
        if is_book(el):
            book_routine(group_record, el)
        elif is_group(el):
            subgroup_record = add_subgroup_record(group_record, el)
            iter_tree(el, subgroup_record, book_routine)
        elif is_group_title(el):
            pass
        else:
            print("Unexpected node: %s" % el)


def is_book(el):
    return el.tag == 'издание'


def is_group(el):
    return el.tag == 'группа'


def is_group_title(el):
    return el.tag == 'название_группы'


def add_subgroup_record(root_record, el):
    title = get_group_title(el)
    subgroup_record = root_record.add_child(title=title)
    return Category.objects.get(pk=subgroup_record.pk)


def get_group_title(el):
    return el.find('название_группы').text.strip()


def add_book(category, el):
    kwargs = get_book_dict(el)
    b = Book(category=category, **kwargs)
    cover_fname = get_book_cover(el)
    if cover_fname is not None:
        b.book_cover.name = cover_fname
    try:
        b.save()
    except:
        print("Error saving book %s" % b.title, sys.exc_info())
    else:
        folders = get_or_create_folders(el)
        if folders is not None:
            for f in folders:
                b.folders.add(f)
            try:
                b.save()
            except:
                print(
                    "Error saving folders of book %s" % b.title,
                    sys.exc_info()
                )


def get_or_create_folders(el):
    folders = []
    folders_container = el.find('site_categories')
    if folders_container is not None:
        for folder_el in folders_container:
            folders.append(
                {'title': folder_el.text.strip(), 'url': folder_el.get('url')}
            )
    if len(folders):
        return [
            Folder.objects.get_or_create(**f)[0] for f in folders
        ]


def get_book_dict(el):
    fnames = (
        ('заголовок', 'title'),
        ('подзаголовок', 'subtitle'),
        ('автор', 'author'),
        ('страниц', 'page_amount'),
        ('код', 'article'),
        ('цена', 'price'),
        ('аннотация', 'annotation'),
        ('город', 'city'),
        ('издательство', 'publisher'),
        ('book_description', 'book_description'),
        ('book_id', 'book_id'),
    )
    d = {}
    for tagname, key in fnames:
        tag = el.find(tagname)
        if tag is not None and tag.text is not None:
            text = tag.text.strip()
            if len(text):
                d[key] = text
    return d


def get_book_cover(el):
    base_url = "http://www.classica21.ru/image/big_pic"
    covers_upload_to = 'book_covers'
    covers_dir = join(settings.MEDIA_ROOT, covers_upload_to)
    makedirs(covers_dir, exist_ok=True)
    cover_tag = el.find('book_bpic')
    if cover_tag is not None and cover_tag.text is not None:
        cover_fname = cover_tag.text.strip()
        if len(cover_fname):
            cover_file_path = join(covers_dir, cover_fname)
            request_url = join(base_url, cover_fname)
            try:
                request.urlretrieve(request_url, cover_file_path)
            except HTTPError as e:
                print('The server couldn\'t fulfill the request.')
                print('Error code: ', e.code)
            except URLError as e:
                print('We failed to reach a server.')
                print('Reason: ', e.reason)
            except:
                print('Unexpected connection error!')
                print('Error details: ', sys.exc_info())
            else:
                return join(covers_upload_to, cover_fname)
