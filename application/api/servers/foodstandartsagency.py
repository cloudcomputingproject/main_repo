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


url = 'http://ratings.food.gov.uk/'
format = 'json'

#private
def getData():
	global url, format

	print url
	#obtaining the data in order to get the number of entries
	data = json.load(urllib2.urlopen(url + '/' + format))

	#building the new url setting the parameter PageSize to be equal to the number of entries
	url += '/1/' + data['FHRSEstablishment']['Header']['ItemCount'] + '/' + format

	data = urllib2.urlopen(url)

	#for testing purposes
	#print url
	#print json.load(data)

	#reseting the url
	url = 'http://ratings.food.gov.uk/'
	#remove the headers, and only get the relevant info
	result = json.load(data)['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail']
	result = json.dumps(result)

	return result

#IMPORTANT!
#
#In order to get data for every location or every restaurant pass 'all' as a value (e.g. searchNameLoc(all, southampton))
def searchNameLoc(name, location):
	global url
	if name == 'all':
		name = '^'
	if location =='all':
		location = '^'
	url += 'search/' + name + "/" + location
	return getData()

def searchName(name):
	global url

	if name == 'all':
		name = '^'
	url += 'search-name/' + name
	return getData()

def searchLoc(location):
	global url
	if location =='all':
		location = '^'
	url += 'search-address/' + location
	return getData()	

#searchNameLoc('tesco','southampton')
#searchName('parfait')
#searchLoc('southampton')