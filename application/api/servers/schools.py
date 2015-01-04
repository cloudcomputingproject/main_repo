"""
handles interaction with the education.data.gov API
"""

import urllib2
import json
import re


from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint, json, jsonify

from flask_cache import Cache



from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel

from application import app


url = 'http://education.data.gov.uk/doc/school.json'

'''
Receives input, creates the URL, and gets the data
Example format for list argument:
['Southampton', ['Less', 1000], 'Mixed', False]
or
['London', False, 'Girls', 'Secondary']
'''

def buildURL(l):

	if (l[0] != False):
		addLocation(l[0])
	if (l[1] != False):
		addCapacity(l[1][0], l[1][1])
	if (l[2] != False):
		addGender(l[2])
	if (l[3] != False):
		addPhaseOfEducation(l[3])

	global url
	url = re.sub('\?', '&', url)
	url = re.sub('&', '?', url, 1)
	url += '&_pageSize=50&_page=0'

	return getData()

'''
Private functions.
These functions are not accessible by other modules,
used to gather all the required data.
'''

def getData():
	global url

	ids = []

	# Gets the schools' IDs from all pages of the search result
	# If 'next' exists in the result, there is next page with results
	print url
	while True:
		opened = urllib2.urlopen(url)
		result = (json.load(opened))['result']
		ids = ids + (getCurrentPageIds(result['items']))
		if 'next' in result:
			url = result['next']
		else:
			break

	return getSchoolsData(ids)

# Gets the data for all schools
def getSchoolsData(ids):
	base_url = 'http://education.data.gov.uk/doc/school/'

	schools = []

	for x in ids:
		schools.append(getSingleSchoolData(base_url + str(x) + '.json'))


	return json.dumps(schools)

# Gets the data for the current school
def getSingleSchoolData(link):

	opened = urllib2.urlopen(link)
	result = (json.load(opened))['result']

	return result['primaryTopic']

# Gets the IDs for all schools on the current page
def getCurrentPageIds(page):
	ids_list = []
	for x in page:
		ids_list.append(x['uniqueReferenceNumber'])
	return ids_list


'''
Private functions.
These functions are not accessible by other modules,
only used to build the correct URLs based on search input
Example arguments are given (case sensitive!)
'''

#City Name
#e.g. 'London'
def addLocation(location):
	global url
	url += '?address.town=' + location

#less, more, equal for comparison, positive integer for value
#e.g. 'Less', 1000 ; 'More' 500 ; ...
def addCapacity(comparison, value):
	global url

	if comparison == 'Less':
		value = value - 1
		url += '?max-schoolCapacity=' + str(value)
	if comparison == 'More':
		value = value + 1
		url += '?min-schoolCapacity=' + str(value)
	if comparison == 'Equal':
		url += '?schoolCapacity=' + str(value)

#Gender type
#available options are: 'Boys' ; 'Girls' ; 'Mixed'
def addGender(gender):
	global url
	url += '?gender.label=' + gender

#If the institution is a school, can be filtered by phase
#available options are: 'Primary' ; 'Secondary'
def addPhaseOfEducation(phase):
	global url
	url += '?phaseOfEducation.label=' + phase
