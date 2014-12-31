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

from servers import police, geocoding, houselisting
from application.parser import parser
from class_definitions import Boundaries
from datetime import date

#List of all the features implemented, the structure is a dictionary, {JsonKeyword, functionName}
featuresOptions = {"police" : lambda arg1, arg2: processPolice(arg1, arg2),
					"weather" : lambda arg1, arg2: processWeather(arg1, arg2),
					"restaurant" : lambda arg1, arg2: processRestaurants(arg1, arg2),
					"house" : lambda arg1, arg2: processHouseListing(arg1, arg2),
					"airquality": lambda arg:processAirquality(arg)}

#### Not sure if used at all
def getCategoriesAPI():
	keys = featuresOptions.keys()
	keys.sort()
	return keys

def getPoliceCategories():
	json = police.getCategories()
	parsed_json = parser.parsePoliceCategories(json)
	return parsed_json

def getPoliceCategoriesWithUrl():
	json = police.getCategories()
	parsed_json = parser.parsePoliceCategoriesWithUrlName(json)
	return parsed_json
#####

def getGeoCoding(location):
	name = location["name"]
	print name
	return geocoding.getData(name)


#takes python object representation of the received JSON object
'''
body of the request has to contain JSON object with the following schema:
{ "selection" : "name"
  "features" : {"name" : "feature_name"},
  "location" : "Some location name or null",
  "area" : [coordinates in here],
  "radius" : {"lat" : "1", "long": "1", "radius": "1", "format": "km/mi"}
 }
'''
def main(data):	
	# Location set up, all the information required will be stored inside location (coordinates and name)
	location = data["location"]
	coordinateSet = data["area"]
	circle = data["radius"]
	if location:
		actualLocation = processLocation(location)
	elif coordinateSet:
		actualLocation = processCoordinates(coordinateSet) #here the coordinates will be processed in an useful way for the server, still to determine
	elif circle:
		actualLocation = processRadius(circle)
	else:
		raise 'A location argument is required'

	selection = data["selection"]
	features = data["features"]

	featuresOptions[selection](features, actualLocation)

	return 'stub'

'''
def main(data):
	print ">> Inside main method controller"	

	if 'geoCoding' in data :
		result = getGeoCoding(data["geoCoding"])
		return "{ \"geoCoding\": %s}" % (result)
	elif 'geoJSON' in data:
		test_response = police.getCategories()
		temp = test_response.read()
		result = temp
		return "{\"geoJSON\": %s}" % (result)

	raise NameError('UnknownRequest: geoCoding or geoJSON was not found.')

	return "This is impossible.."
'''

def main2(data):
	print "inside main method controller"
	location = data["location"]
	print location
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
	return Boundaries(nEast, sWest, place)

def processCoordinates(coordinateSet):
	return "nothing"

def processRadius(circle):
	center[0] = circle["lat"]
	center[1] = circle["long"]
	radius = circle["radius"]
	radiusFormat = circle["format"]
	return CircleArea(center, radius, radiusFormat)

#takes array of features
def processFeatures(features):
	print "processFeatures"
	response =""
	for feature in features:
		print "Feature name:",feature['name']
		response+=(featuresOptions[feature["name"]](feature["args"]))
		#test 
		parsed = "{\r\n\r\n    \"type\":\"FeatureCollection\",\r\n    \"features\":[\r\n        {\r\n            \"type\":\"Feature\",\r\n            \"geometry\":{\r\n                \"type\":\"Point\",\r\n                \"coordinates\":[\r\n                    102.0,\r\n                    0.388799\r\n                ]\r\n            },\r\n            \"properties\":{\r\n                \"type\":\"police\"\r\n            }\r\n        },\r\n        {\r\n            \"type\":\"Feature\",\r\n            \"geometry\":{\r\n                \"type\":\"Point\",\r\n                \"coordinates\":[\r\n                    52.333833,\r\n                    0.487521\r\n                ]\r\n            },\r\n            \"properties\":{\r\n                \"type\":\"police\"\r\n            }\r\n        },\r\n        {\r\n            \"type\":\"Feature\",\r\n            \"geometry\":{\r\n                \"type\":\"Point\",\r\n                \"coordinates\":[\r\n                    52.371837,\r\n                    0.481811\r\n                ]\r\n            },\r\n            \"properties\":{\r\n                \"type\":\"police\"\r\n            }\r\n        }\r\n    ]\r\n\r\n}"

		'''
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		TO PARSE
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		'''
		
		print response
		return response

def processPolice(policeArgs, location):
	print policeArgs
	category = policeArgs["category"]
	someDate = date.today()
	someDate = str(someDate.year)+"-"+str(someDate.month-2)
	print category
	print someDate
	#neigh = police.getNeighbourhoods('hampshire').read()
	#boundry =  police.getBoundary('hampshire', 'Fair Oak').read()
	#crimes= police.getCrimes('all-crimes', 52.629729, -1.131592, '2014-09').read()
	crimesArea = police.getCrimesInArea(category, [52.268, 52.794, 52.130], [0.543, 0.238, 0.478], someDate).read()
	#return "NEIGHBOURHOOD"+"*"*10+"\n"+neigh+"BOUNDRY"+"*"*10+"\n"+boundry+"crimes"+"*"*10+"\n"+crimes+"crimesArea"+"*"*10+"\n"+crimesArea
	parsed = parser.parseCrimes(crimesArea)
	return parsed

def processWeather(weatherArgs, location):
	print processHouses

def processRestaurants(restaurantArgs, location):
	print restaurantArgs

def processAirquality(airqualityArgs, location):
	print airqualityArgs

def processHouseListing(houseArgs, location):
	jsonData = houselisting.getData(location)
	collection = parser.parseHouseListing(jsonData)
	return 'JSON result'