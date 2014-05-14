# -*- coding: utf-8 -*-
from PIL import Image
from StringIO import StringIO
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import os


class PhotoView:
    suffix = '_avatar_view'
    width = 100
    height = 100
    format = '.jpeg'

    def get(self, photo):
        name,ext = os.path.splitext(photo.name)
        return name + self.suffix + self.format

    def create(self, photo):
        view = photo.file
        view.seek(0)
        newImage = Image.open(StringIO(view.read()))
        if newImage.mode != "RGB":
            newImage = newImage.convert("RGB")
        newImage.thumbnail((self.width, self.height), Image.ANTIALIAS)

        thumb = StringIO()
        newImage.save(thumb, 'jpeg', quality=80, optimize=True, progressive=True)

        name, ext = os.path.splitext(photo.name)
        default_storage.save(name + self.suffix + self.format, ContentFile(thumb.getvalue()))


class AvatarThumbPhotoView(PhotoView):
    suffix = '_avatar_thumb'
    width = 60
    height = 60


class PhotoPreviewPhotoView(PhotoView):
    suffix = '_photo_preview'
    width = 160
    height = 160


class CompanyViewPhotoView(PhotoView):
    suffix = '_company_view'
    width = 700
    height = 1000


