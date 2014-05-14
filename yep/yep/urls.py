from django.conf.urls import patterns, include, url
from core.views import AboutView


urlpatterns = patterns('',
    url(r'^$', 'core.views.company', name='home'),
    url(r'^company/$', 'core.views.company', name='company-list.html'),
     url(r'^company/(\d+)/edit/$', 'core.views.edit_company', name='edit_company'),
    url(r'^', include('core.urls')),
    url(r'^trash/', include('trash.urls'))
)