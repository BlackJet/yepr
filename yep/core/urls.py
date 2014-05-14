from django.conf.urls import patterns, include, url

import api

category_resource = api.CategoryResource()
company_resource = api.CompanyResource()

urlpatterns = patterns('',
    url(r'^photo/$', include('photo.urls')),

    url(r'^api/', include(category_resource.urls)),
    url(r'^api/', include(company_resource.urls))
)
