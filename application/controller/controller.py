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
from class_definitions import Boundaries

#List of all the features implemented, the structure is a dictionary, {JsonKeyword, functionName}
featuresOptions = {"police" : lambda arg: processPolice(arg),
					"weather" : lambda arg: processWeather(arg),
					"restaurants" : lambda arg: processRestaurants(arg)}

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
		return processFeatures(features)
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
	response =""
	for feature in features:
		response+=(featuresOptions[feature["name"]](feature["args"]))
		print feature['name']
		return response

def processPolice(policeArgs):
	print policeArgs
	
	neigh = police.getNeighbourhoods('hampshire').read()
	boundry =  police.getBoundary('hampshire', 'Fair Oak').read()
	crimes= police.getCrimes('all-crimes', 52.629729, -1.131592, '2014-09').read()
	crimesArea = police.getCrimesInArea('all-crimes', [52.268, 52.794, 52.130], [0.543, 0.238, 0.478], '2014-09').read()
	return "NEIGHBOURHOOD"+"*"*10+"\n"+neigh+"BOUNDRY"+"*"*10+"\n"+boundry+"crimes"+"*"*10+"\n"+crimes+"crimesArea"+"*"*10+"\n"+crimesArea

def processWeather(policeArgs):
	print policeArgs

def processRestaurants(policeArgs):
	print policeArgs

