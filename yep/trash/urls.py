from django.conf.urls import patterns, url
from django.views.generic import TemplateView


urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name="trash_index.html"), name="editCategories"),
    url(r'^categories$', TemplateView.as_view(template_name="categories/edit.html"), name="editCategories"),
    url(r'^companies$', TemplateView.as_view(template_name="tcompany_edit.html"), name="editCompanies"),
)
