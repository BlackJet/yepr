# coding=utf-8

from django.db import models
from django.forms import ModelForm
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    name = models.TextField(null=False, blank=False)
    parent = TreeForeignKey('self', null=True, blank=True)

    class Meta:
        db_table = "category"


class CategoryForm(ModelForm):
    def clean_name(self):
        return self.cleaned_data['name'].strip()

    class Meta:
        model = Category


class Company(models.Model):
    name = models.CharField(blank=False, max_length=500)
    createDate = models.DateTimeField(db_column='create_date', auto_now_add=True, blank=False)
    categories = models.ManyToManyField(Category, blank=True, null=True)

    class Meta:
        db_table = 'company'


class CompanyForm(ModelForm):
    # С помощью этого не позволяем использовать имена состоящие из одних пробелов
    def clean_name(self):
        return self.cleaned_data['name'].strip()

    class Meta:
        model = Company


class City(models.Model):
    name = models.CharField(blank=False, max_length=100)

    class Meta:
        db_table = 'city'
        ordering = ['name']


class Area(models.Model):
    name = models.CharField(blank=False, max_length=100)

    class Meta:
        db_table = 'area'
        ordering = ['name']


class Street(models.Model):
    name = models.CharField(blank=False, max_length=100)

    class Meta:
        db_table = 'street'
        ordering = ['name']


class Address(models.Model):

    company = models.ForeignKey(Company)

    city = models.TextField(max_length=500)
    area = models.CharField(max_length=500)
    street = models.CharField(max_length=500)

    building = models.CharField(max_length=100)
    corpus = models.CharField(max_length=100)
    flat = models.CharField(max_length=100)
    addressInfo = models.TextField(db_column='address_info')

    email = models.EmailField(blank=True)
    website = models.URLField(blank=True, max_length=500)
    postIndex = models.CharField(db_column='post_index', blank=True, max_length=100)

    phone = models.CharField(blank=True, max_length=500)
    icq = models.CharField(blank=True, max_length=500)
    skype = models.CharField(blank=True, max_length=500)

    workTime = models.CharField(db_column='work_time', blank=True, max_length=500)

    latitude = models.FloatField(blank=True)
    longitude = models.FloatField(blank=True)

    class Meta:
        db_table = 'address'


class AddressForm(ModelForm):
    class Meta:
        model = Address