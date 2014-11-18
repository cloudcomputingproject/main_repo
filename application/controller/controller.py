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
from servers import geocoding

#List of all the features implemented, the structure is a dictionary, {JsonKeyword, functionName}
featuresOptions = {"police" : processPolice,
					"weather" : processWeather,
					"restaurants" : processRestaurants}

def getGeoCoding(location):
	name = location["name"]
	print name
	return geocoding.getData(name).read()
#takes python object representation fo the received JSON object
def main(data):
	location = data["location"]
	if location:
		actualLocation = processLocation(location)
	features = data["features"]
	if features:
		processFeatures(features)
	#test response will be the response from
	#the module taking care of a communication 
	#with some external API
	#we parse that response with the PARSER
	#and return it to the request handler
	print actualLocation.locationName
	print "Latitude: " + str(actualLocation.southWest[0]) + ", Longitude: " + str(actualLocation.southWest[1])
	print actualLocation.northEast
	test_response = police.getCategories()
	
	temp = test_response.read()

	return temp

def processLocation(location):
	nEast = location["bounds"]["NorthEast"]
	sWest = location["bounds"]["SouthWest"]
	place = location["name"]
	return Boundaries(nEast, sWest, place	)

#takes array of features
def processFeatures(features):
	for feature in features:
		featuresOptions[feature["name"]](feature["args"])
		print feature['name']

def processPolice(policeArgs):
	print policeArgs

def processWeather(policeArgs):
	print policeArgs

def processRestaurants(policeArgs):
	print policeArgs

# Container class, it contains a location given by leaflet
class Boundaries:
	def __init__(self, northEast=[0,0], southWest=[0,0], locationName="undefined"):
		self.northEast = northEast
		self.southWest = southWest
		self.locationName = locationName
