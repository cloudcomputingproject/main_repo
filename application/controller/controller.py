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
from application.parser import parser
from class_definitions import Boundaries
from datetime import date

#List of all the features implemented, the structure is a dictionary, {JsonKeyword, functionName}
featuresOptions = {"police" : lambda arg: processPolice(arg),
					"weather" : lambda arg: processWeather(arg),
					"restaurant" : lambda arg: processRestaurants(arg)}
def getCategoriesAPI():
	keys = featuresOptions.keys()
	keys.sort()
	return keys

def getPoliceCategories():
	json = police.getCategories()
	parsed_json = parser.parsePoliceCategories(json)
	return parsed_json


def getGeoCoding(location):
	name = location["name"]
	print name
	return geocoding.getData(name)
#takes python object representation of the received JSON object
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

	#location = data["location"]
	#if location:
	#	actualLocation = processLocation(location)
	# features = data["features"]
	# if features:
	# 	return processFeatures(features)
	#test response will be the response from
	#the module taking care of a communication 
	#with some external API
	#we parse that response with the PARSER
	#and return it to the request handler
	# print "Location name: " + actualLocation.locationName
	# print "Latitude: " + str(actualLocation.southWest[0]) + ", Longitude: " + str(actualLocation.southWest[1])
	# print actualLocation.northEast
	return "This is impossible.."

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
	print "processLocation"
	nEast = location["bounds"]["NorthEast"]
	sWest = location["bounds"]["SouthWest"]
	place = location["name"]
	print nEast,sWest,place
	return Boundaries(nEast, sWest, place)

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

def processPolice(policeArgs):
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

def processWeather(policeArgs):
	print policeArgs

def processRestaurants(policeArgs):
	print policeArgs

