import urllib2
import json

from application.controller.exceptions import NodeExcessException

from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint, json, jsonify

from flask_cache import Cache



from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel

from application import app

url = 'http://data.police.uk/api/'

#private
def getData():
	global url
	#json object
	try:
		data = urllib2.urlopen(url, timeout = 20)
	except urllib2.URLError, e:
		url = 'http://data.police.uk/api/'
		raise NodeExcessException("The nodes returned by your query exceed the 10,000 limit")
	except Exception as e:
		url = 'http://data.police.uk/api/'
		raise
	else:
	#for testing purposes
	#print url
		url = 'http://data.police.uk/api/'
		data = json.load(data)
		
		result = json.dumps(data)
		return result

def getCategories():
	global url

	url += 'crime-categories?date='+lastUpdated()
	return getData()
			
#date must be in the format yyyy-mm
def getCrimesInAreaData(category, latArr, lngArr, date):
	global url
	result = '['
	for c in category:
		if c is not None:
			cat = c
			url+='crimes-street/' + cat + '?poly='
			for j in xrange(0, len(latArr)):
				url+=str(latArr[j]) + ',' + str(lngArr[j]) + ':'
			url = url[:-1]
			url+='&date=' + date
			result += getData()[1:-1] + ','
			if cat is 'all-crime':
				break

	result = result[:-1] + ']'

	return result

def lastUpdated():
	lastUpdated = urllib2.urlopen('http://data.police.uk/api/crime-last-updated')
	lastUpdated = json.load(lastUpdated)
	lastUpdated = lastUpdated['date'][:7]

	return lastUpdated


#http://data.police.uk/api/crimes-street/all-crime?poly=51.6723432,0.148271:51.3849401,0.148271:51.3849401,-0.3514683:51.6723432,-0.3514683&date=2014-09
#getCategories()
#getCrimesInAreaData(['vehicle-crime', 'other-theft'], [52.268, 52.794, 52.130], [0.543, 0.238, 0.478], '2014-08')