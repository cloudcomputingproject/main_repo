import urllib2
import json
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError
from flask import request, render_template, flash, url_for, redirect, Blueprint, json, jsonify
from flask_cache import Cache
from pprint import pprint

from application.decorators import login_required, admin_required
from application.forms import ExampleForm

from application import app

from servers import police
#takes python object representation fo the received JSON object
def main(data):
	location = data["location"]
	if location:
		processLocation(location)
	features = data["features"]
	if features:
		processFeatures(features)
	#test response will be the response from
	#the module taking care of a communication 
	#with some external API
	#we parse that response with the PARSER
	#and return it to the request handler
	test_response = police.getCategories()

	temp = test_response.read()

	return temp
def processLocation(location):
	#TODO
	return 
#takes array fo features
def processFeatures(features):
	for feature in features:
		#TODO
		print feature['name']

