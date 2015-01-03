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

url = 'http://api.nestoria.co.uk/api?'
format = 'json'
country = 'uk'
pretty = '1'

#private
def getData():
	global url

	#for testing purposes
	# print url
	# print json.load(data)
	data = urllib2.urlopen(url+'1')
	data = json.load(data)

	result = '['

	for i in range(0, int(data['response']['total_pages'])):
		data = urllib2.urlopen(url + str(i+1))
		data = json.load(data)

		result += json.dumps(data['response']['listings'])[1:-1] + ', '

		

	result = result[:-2] + ']'

	url = 'http://api.nestoria.co.uk/api?'
	return result

#private
def urlBuild(req):
	global url

	url += 'pretty=' + pretty + '&'

	if(type(req) is str):
		url += 'place_name=' + req + '&'

	elif(req and len(req) == 4):
		if(req[3] == 'km' or req[3] == 'mi'):
			url += 'centre_point=' + str(req[0]) + ',' + str(req[1]) + ',' + str(req[2]) + req[3] + '&'
		elif(req[3]):
			url += 'south_west=' + str(req[0]) + ',' + str(req[1]) + '&north_east=' + str(req[2]) + ',' + str(req[3]) + '&'


#req is expected to be a name of a plcae or an array with 4 elements with either
#	4 numbers indicating the lat,lng of the south west and north east points of the area
#	OR
#	3 numbers indicating the lat,lng of a point that is going to be considered a center of the area
#	followed by the radius and either 'km' or 'mi' as the last 4th element
def getListing(req,listing_type):
	global url
	
	urlBuild(req)

	url += 'encoding=' + format + '&action=search_listings&country=' + country + "&listing_type=" + listing_type + "&number_of_results=50&page="
	return getData()

#getListing([51,-3,10,'km'],'rent')
#getListing('southampton','rent')
