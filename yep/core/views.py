# -*- coding: utf-8-*-
import math

from django.http import HttpResponse
from django.shortcuts import render

from core.models import Company, City, Street, Area


def home(request):
    return render(request,'index.html')

PAGE_SIZE = 20.0
ANCHORED = 2


def company(request):
    p = int(request.GET.get('p', 1))
    total = Company.objects.count()
    offset = (p - 1) * PAGE_SIZE
    limit = offset + PAGE_SIZE

    page_total = int(math.ceil(total / PAGE_SIZE))
    companies = Company.objects.all()[offset:limit]
    page_anchors = get_nav_pages(page_total, p, ANCHORED)
    return render(request, 'index.html', dict(companies=companies, total=total, page_anchors=page_anchors, page=p))


def get_nav_pages(s, p, a):

    if s == 0 or s == 1: return []
    if p < 1: p = 1
    if p > s: p = s

    q = s if p + a >= s else p + a
    x = range(p, q + 1)
    if q < s:
        x += range(q + 1, s + 1) if 0 < s - q <= 2 else ['...', s]
    else:
        x = range(p, s + 1)

    x = [1, '...', p - 1] + x if p > 4 else range(1, p) + x

    return x


def edit_company(request, id):
    company = Company.objects.get(id=id)
    cities = City.objects.all()
    streets = Street.objects.all()
    areas = Area.objects.all()
    return render(request, 'company_edit.html', dict(company=company, cities=cities, streets=streets, areas=areas))


from django.views.generic.base import View

class AboutView(View):

    def get(self,request, *args, **kwargs):
        return HttpResponse('hello ya')