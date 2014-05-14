# -*- coding: utf-8 -*-
from django.core.files.storage import default_storage
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver
import os
from django.db import models
from django.db.models.fields.files import ImageField


class Photo(models.Model):
    photo = ImageField(upload_to='photo/')
    photoViews = list()

    def __init__(self, *args, **kwargs):
        self.photoViews = kwargs.pop('photoViews', [])
        super(Photo, self).__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        x = self.photo
        self.photo = None
        super(Photo, self).save(*args, **kwargs)
        name, ext = os.path.splitext(x.name)
        x.name = unicode(self.id) + ext
        self.photo = x
        super(Photo, self).save(*args, **kwargs)

        for p in self.photoViews:
            # оригинал для фото здесь уже присвоено
            p.create(self.photo)

    def get(self,photoView):
        return photoView.get(self.photo)

    class Meta:
        db_table = 'photo'

@receiver(post_delete, sender=Photo)
def delete_photo_files(sender, instance, created, **kwargs):
    default_storage.delete(instance.photo.path)
#if not os.path.isfile(task.seq_file.path):