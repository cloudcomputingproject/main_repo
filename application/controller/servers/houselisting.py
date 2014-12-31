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

cache = Cache(app)
# http://www.nestoria.co.uk/help/api-search-listings easy, just need to get the functions, it will need as arguments: location/ne-sw
def getData(place):
	country = 'uk'
	locationParameter = ''
	if isinstance(place, Boundaries):
		locationParameter = '&place_name=' + place.locationName
	elif isinstance(place, CircleArea):
		locationParameter = '&centre_point=' + place.center[0] + ',' + place.center[1]
		if place.radius > 0:
			locationParameter += ',' + place.radius + place.radiusFormat
	#elif isinstance(place, ) area, not admitted here
	url = "http://api.nestoria.co.uk/api?listing_type=buy&country=" + country + "&action=search_listings&encoding=json&pretty=1" + locationParameter
	request = urllib2.urlopen(url)	
	
	return request.read()