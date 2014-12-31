import urllib2
import json
"""
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError
from flask import request, render_template, flash, url_for, redirect, Blueprint
from flask_cache import Cache
from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel
from application import app
"""

url = 'http://api.nestoria.co.uk/api?'
format = 'json'
country = 'uk'
pretty = '1'

#private
def getData():
	global url
	#json object
	data = urllib2.urlopen(url)

	#for testing purposes
	# print url
	# print json.load(data)

	url = 'http://api.nestoria.co.uk/api?'

	result = json.load(data)['response']
	result = json.dumps(result)

	return result

	"""
	#parsing metadata
	data = json.loads(result)
	data = data['metadata'][1]['data']
	
	strData = str(data)
	key = strData[3:strData.index(":",2)-1]
	
	data = data[key]
	avgPrice = data['avg_price']
	datapoints = data['datapoints']
	"""


#private
def urlBuild(name, array):
	global url

	url += 'pretty=' + pretty + '&'

	if(name):
		url += 'place_name=' + name + '&'

	elif(array and len(array) == 4):
		if(array[3] == 'km' or array[3] == 'mi'):
			url += 'centre_point=' + str(array[0]) + ',' + str(array[1]) + ',' + str(array[2]) + array[3] + '&'
		elif(array[3]):
			url += 'south_west=' + str(array[0]) + ',' + str(array[1]) + '&north_east=' + str(array[2]) + ',' + str(array[3]) + '&'

"""
def getKeywords():
	global url
	url += 'country=' + country + '&action=keywords&encoding=' + format
	getData()
"""

#array is expected to have 4 elements with either
#	4 numbers indicating the lat,lng of the south west and north east points of the area
#	OR
#	3 numbers indicating the lat,lng of a point that is going to be considered a center of the area
#	followed by the radius and either 'km' or 'mi' as the last 4th element
def getListing(name, array):
	global url

	urlBuild(name, array)

	url += 'encoding=' + format + '&action=search_listings&country=' + country
	return getData()

def getMetadata(name, array):
	global url

	urlBuild(name, array)

	url += 'country=' + country + '&action=metadata&encoding=' + format 
	getData()

#getKeywords()
#getListing(False,[51,-3,10,'km'])
#getListing('southampton',[0,0,1,1])
#getListing('southampton',[0,0])
#getMetadata('Southampton',[])