from photo.models import Photo
from photo.classes import CompanyViewPhotoView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core import serializers
import json

@csrf_exempt
def upload(request):
    attachedPhotoFiles = [(fieldName, file) for fieldName, file in request.FILES.iteritems() if 'photo' in fieldName]
    ids = []
    for fieldName, file in attachedPhotoFiles:
        photo = Photo(photo=file)
        photo.save()
        ids.append(photo.id)
    return HttpResponse(json.dumps(ids, sort_keys=True, indent=2), content_type="application/json")




