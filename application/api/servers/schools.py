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
['Southampton', ['less', 1000], 'Mixed', False]
or
['London', False, 'Girls', 'Secondary']
'''

def buildURL(list):
	if (list[0] != False):
		addLocation(list[0])
	if (list[1] != False):
		addCapacity(list[1][0], list[1][1])
	if (list[2] != False):
		addGender(list[2])
	if (list[3] != False):
		addPhaseOfEducation(list[3])

	global url
	url = re.sub('\?', '&', url)
	url = re.sub('&', '?', url, 1)
	url += '&_pageSize=50&_page=0'
	
	# try:
	# 	test = getData()
	# except Exception as e:
	# 	print e.message
	# 	test = 'a'
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
	
	while True:
		opened = urllib2.urlopen(url)
		result = (json.load(opened))['result']
		ids = ids + (getCurrentPageIds(result['items']))
		if 'next' in result:
			url = result['next']
		else:
			break

	results = getSchoolsData(ids)

	print len(results)
	print type(results)

	#for x in results:
	#	print json.dumps(x, indent=4)

# Gets the data for all schools
def getSchoolsData(ids):
	base_url = 'http://education.data.gov.uk/doc/school/'

	schools = []

	for x in ids:
		schools.append(getSingleSchoolData(base_url + str(x) + '.json'))

	return schools

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
#e.g. 'less', 1000 ; 'more' 500 ; ...
def addCapacity(comparison, value):
	global url

	if comparison == 'less':
		value = value - 1
		url += '?max-schoolCapacity=' + str(value)
	if comparison == 'more':
		value = value + 1
		url += '?min-schoolCapacity=' + str(value)
	if comparison == 'equal':
		url += '?schoolCapacity=' + str(value)

#Gender type
#available options are: 'Boys' ; 'Girls' ; 'Mixed'
def addGender(gender):
	global url
	url+= '?gender.label=' + gender

#If the institution is a school, can be filtered by phase
#available options are: 'Primary' ; 'Secondary'
def addPhaseOfEducation(phase):
	global url
	url+= '?phaseOfEducation.label=' + phase


# for testing purposes
#buildURL(['Southampton', ['less', 101], False, False])