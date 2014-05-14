# coding=utf-8
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.validation import FormValidation
import models


class CategoryResource(ModelResource):
    parent_id = fields.IntegerField("parent_id", null=True, blank=True)

    class Meta:
        queryset = models.Category.objects.all()

        # Отдаем клиенту список категорий полностью
        limit = 0
        max_limit = 0

        # Исключаем служебные поля необходимые для хранения дерева
        excludes = ['lft', 'rght', 'tree_id', 'level']

        resource_name = "category"
        include_resource_uri = False

        validation = FormValidation(form_class=models.CategoryForm)

        authentication = Authentication()   # TODO: добавить необходимость аутентификации
        authorization = Authorization()     # TODO: добавить необходимость аутентификации для редактирования категорий


class AddressResource(ModelResource):
    def can_update(self):
        return False

    class Meta:
        queryset = models.Address.objects.all()

        resource_name = "address"
        include_resource_uri = False

        validation = FormValidation(form_class=models.AddressForm)

        authentication = Authentication()   # TODO: добавить необходимость аутентификации
        authorization = Authorization()     # TODO: добавить необходимость аутентификации для редактирования компаний


class CompanyResource(ModelResource):
    categories = fields.ToManyField(CategoryResource, "categories", full=True, blank=True)
    address_set = fields.ToManyField(AddressResource, "address_set", full=True, blank=True, null=True)

    def save_m2m(self, bundle):
        bundle.obj.address_set.all().delete()

        if "address_set" in bundle.data:
            for address_bundle in bundle.data["address_set"]:
                if not address_bundle.obj.company_id:
                    address_bundle.obj.company_id = bundle.obj.pk

        super(CompanyResource, self).save_m2m(bundle)

    class Meta:
        queryset = models.Company.objects.all()

        resource_name = "company"
        include_resource_uri = False

        validation = FormValidation(form_class=models.CompanyForm)

        authentication = Authentication()   # TODO: добавить необходимость аутентификации
        authorization = Authorization()     # TODO: добавить необходимость аутентификации для редактирования компаний