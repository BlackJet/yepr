"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

# from django.test import TestCase
#
#
# class SimpleTest(TestCase):
#     def test_basic_addition(self):
#         """
#         Tests that 1 + 1 always equals 2.
#         """
#         self.assertEqual(1 + 1, 2)
#
#


import sys
import os

sys.path.append(os.path.realpath(os.path.join(os.path.dirname(__file__), os.path.pardir)))
os.environ['DJANGO_SETTINGS_MODULE'] = 'yep.settings'

# from core.models import Company

# c = Company(name='Yamaha')
# c.save()
# print Company.objects.count()


