"""
handles interaction with the worldbank api

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

def getData(dataType, date, format):
	url = "http://api.worldbank.org/countries/gbr/indicators/" + dataType + "?" + date + "&" + format
	request = urllib2.urlopen(url)	
	result = json.load(request)[1][0]
	
	return result
