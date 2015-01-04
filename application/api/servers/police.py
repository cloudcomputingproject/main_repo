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
		data = urllib2.urlopen(url, timeout = 50)
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

def combineResult(resultsArray):
	result = ''
	for r in resultsArray:
		result += r[1:-1] + ','
	return result

#Divides a square in 4 interior squares
#the format of the output will be:
# [[sq1Lat, sq1Lng],[sq2Lat, sq2Lng],[sq3Lat, sq3Lng],[sq4Lat, sq4Lng]]			
def getDivision(latArr, lngArr):
	midLat = (latArr[0] + latArr[1])/2
	midLng = (lngArr[0] + lngArr[2])/2
	sq1 = [[latArr[0], midLat, midLat, latArr[0]],[lngArr[0], lngArr[0], midLng, midLng]]
	sq2 = [[latArr[1], midLat, midLat, latArr[1]],[lngArr[1], lngArr[1], midLng, midLng]]
	sq3 = [[latArr[2], midLat, midLat, latArr[2]],[lngArr[2], lngArr[2], midLng, midLng]]
	sq4 = [[latArr[3], midLat, midLat, latArr[3]],[lngArr[3], lngArr[3], midLng, midLng]]
	return [sq1, sq2, sq3, sq4]

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
			try:
				result += getData()[1:-1] + ','
			except NodeExcessException as e:
				if len(latArr) > 4 or len(lngArr) > 4:
					raise
				divisionResults = []
				squareDivisions = getDivision(latArr, lngArr)
				divisionResults.append(getCrimesInAreaData(category, squareDivisions[0][0], squareDivisions[0][1], date))
				divisionResults.append(getCrimesInAreaData(category, squareDivisions[1][0], squareDivisions[1][1], date))
				divisionResults.append(getCrimesInAreaData(category, squareDivisions[2][0], squareDivisions[2][1], date))
				divisionResults.append(getCrimesInAreaData(category, squareDivisions[3][0], squareDivisions[3][1], date))
				aux = combineResult(divisionResults)
				if aux is not '':
					result += combineResult(divisionResults)
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