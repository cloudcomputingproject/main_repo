"""
handles interaction with the food standartds agency api
"""

import urllib2
import json

from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint

from flask_cache import Cache



from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel

from application import app

# Flask-Cache (configured to use App Engine Memcache API)
cache = Cache(app)

def getData(name, location, format):
	url = "http://ratings.food.gov.uk/search/" + name + "/" + location + "/" + format
	data = urllib2.urlopen(url)
	#remove the headers, and only get the relevant info
	result = json.load(data)['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail']

	return result