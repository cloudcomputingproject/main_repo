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

'''
 API Key for geocoding can be found here:
	https://console.developers.google.com/project/cobalt-mantis-732/apiui/credential

Example link (need to edit api key): 
	https://maps.googleapis.com/maps/api/geocode/json?address=122+Flinders+St,+Darlinghurst,+NSW,+Australia&sensor=false&key={key}

'''

API_KEY = "AIzaSyAXZycyWt-ZGGooaAycfCyfZuV1W5uKBGg"

components = "components=country:UK"
def getData(address):
	url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&"+components+"&"+"sensor=false"+"&"+"key="+API_KEY
	request = urllib2.urlopen(url)	
	result = json.load(request)
	
	return result

def getBounds(address):
	locationData = getData(address)
	bounds = locationData["results"][0]["geometry"]["bounds"]
	result = [[bounds["northeast"]["lat"], bounds["northeast"]["lng"]],[bounds["southwest"]["lat"], bounds["southwest"]["lng"]]]
	return result

def getCoordinates(address):
	locationData = getData(address)
	location = locationData["results"][0]["geometry"]["location"]
	result = [location["lat"], location["lng"]]
	return result