import urllib2
import json

from application.controller.exceptions import NodeExcessException
"""
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint, json, jsonify

from flask_cache import Cache



from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel

from application import app
"""
url = 'http://data.police.uk/api/'

#private
def getData():
	global url
	#json object
	try:
		print url
		data = urllib2.urlopen(url)
	except urllib2.URLError, e:
		url = 'http://data.police.uk/api/'
		raise NodeExcessException("The nodes returned by your query exceed the 10,000 limit")
	else:
	#for testing purposes
	#print url
		url = 'http://data.police.uk/api/'
		data = json.load(data)
		
		result = json.dumps(data)
		return result

def getCategories():
	global url

	lastUpdated = urllib2.urlopen('http://data.police.uk/api/crime-last-updated')
	lastUpdated = json.load(lastUpdated)
	lastUpdated = lastUpdated['date'][:7]

	url += 'crime-categories?date='+lastUpdated
	return getData()

#Neighbourhoods must be lower case and the white spaces replaced with '-'
def getNeighbourhoodsData(county):
	global url
	url += county + '/neighbourhoods'
	return getData()

def getBoundaryData(county, nhood):
	global url
	url += county + '/' + getNeighbourhoodID(county, nhood) + '/boundary'
	return getData()

#private
def getNeighbourhoodID(county, nhood):
	global url
	url+= county + '/neighbourhoods'
	data = json.load(urllib2.urlopen(url))
	
	for j in xrange(0, len(data)):
		if data[j]["name"] == nhood:
			return data[j]["id"]
			
#date must be in the format yyyy-mm
def getCrimesData(category, lat, lng, date):
	global url
	url+='crimes-street/' + category + '?lat=' + str(lat) + '&lng=' + str(lng) + '&date=' + date
	return getData()

def getCrimesInAreaData(category, latArr, lngArr, date):
	global url
	for c in category:
		if c is not None:
			cat = c
			break
	url+='crimes-street/' + cat + '?poly='
	for j in xrange(0, len(latArr)):
		url+=str(latArr[j]) + ',' + str(lngArr[j]) + ':'
	url = url[:-1]
	url+='&date=' + date

	return getData()


#http://data.police.uk/api/crimes-street/all-crime?poly=51.6723432,0.148271:51.3849401,0.148271:51.3849401,-0.3514683:51.6723432,-0.3514683&date=2014-09
#getCategories()
#getNeighbourhoodsData('hampshire')
#getBoundaryData('hampshire', 'Fair Oak')
#getCrimesData('all-crimes', 52.629729, -1.131592, '2014-09')
#getCrimesInAreaData('all-crimes', [52.268, 52.794, 52.130], [0.543, 0.238, 0.478], '2014-09')