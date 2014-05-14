# -*- coding: utf-8 -*-
from django import template
register = template.Library()
@register.filter
def photo_filter(photo, className):
    cls = getattr(photo.classes, className)
    return cls().get(photo.photo)
# {% load filters %}
# {% if company.thumb %}
#     <li class="company-thumb"
#         style="background:url({{ MEDIA_URL }}{{ company.thumb|photo_filter:'CompanyThumbPhotoView' }});"></li>
# {% else %}

