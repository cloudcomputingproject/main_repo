import urllib2
import json

from flask_cache import Cache
from pprint import pprint
from datetime import date, timedelta

from application import app
from application.decorators import login_required, admin_required
from application.api.servers import houses, police, geocoding, foodstandartsagency, worldbank, schools ,airquality
from application.parser import parser
from class_definitions import Boundaries, CircleArea
from application.controller.exceptions import InvalidValue

#List of all the features implemented, the structure is a dictionary, {JsonKeyword, functionName}
featuresOptions = {
	"police" : lambda arg: processPolice(arg),
	"weather" : lambda arg: processWeather(arg),
	"restaurant" : lambda arg: processRestaurants(arg),
	"house" : lambda arg: processHouseListing(arg),
	"airquality": lambda arg:processAirquality(arg),
	"geocoding" : lambda arg: getGeoCoding(arg),
	"schools" : lambda arg: processSchools(arg)
}

locationOptions = {
	"place" : lambda arg: processPlace(arg),
	"rectangle" : lambda arg: processPlace(arg),
	"polygon" : lambda arg: processPolygon(arg),
	"area" : lambda arg: processArea(arg)
}
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
	print 'G-C-============================================'
	print '######'
	print '> getGeoCoding'
	print '######'
	print 'name: '
	name = location["location"]["name"]
	print name
	data = geocoding.getData(name)
	print '> data retrieved from geocoding'
	return data

#takes python object representation of the received JSON object
'''
Request (just one location depending on the format)
    {
    	"name": "geocoding/api",
    	"args": {
    		"category": "all-crimes",
            "location": {
            	"type": "place",
                "name": "CityName",
                "bounds": {
	            	"northEast": 1,
	            	"southWest": 1
	            }
            },
            "location": {
            	"type": "polygon",
                "points": [[1,1], [0,0], [0,2]]
            },
            "location": {
            	"type": "area",
                "lat": 1,
                "long": 1,
                "radius": 2,
                "format": "km/mi"
            },
            "any-other-parameter": "value"
    	}
    }
Response
    {
    	"api" : "police/house/etc",
    	"data" : {
				    "features": [
				        {
				            "geometry": {
				                "coordinates": [
				                    -1.3485599756240845,
				                    50.907440185546875
				                ],
				                "type": "Point"
				            },
				            "id": null,
				            "properties": {
				                "bathNumber": 1,
				                "bedroomNumber": 2,
				                "currency": "GBP",
				                "lastUpdated": 286.5,
				                "price": 229950
				            },
				            "type": "Feature"
				        }
				    ],
				    "type": "FeatureCollection"
				}
    }
'''
def main(data):	

	jsonResult = 'There was some error retrieving the data...'

	if 'name' in data:
		name = data["name"]
	else:
		raise Exception("The request must include the name of the API requested")

	if 'args' in data:
		args = data["args"]
	else:
		args = None

	#If the feature has different calls or needs, they will be inside the features object in the JSON request
	# The appropiate method will then strip it out and call the appropiate method of the server/parser
	if name in featuresOptions:
		jsonResult = featuresOptions[name](args) 
	else: 
		raise Exception( "Selection is not valid")
	response = "{ \"api\": \"%s\", \"data\": %s}" % (name, jsonResult)

	return response

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

def processPlace(placeArgs):
	nEast = None
	sWest = None
	if placeArgs["type"] == "place":
		if 'bounds' in placeArgs:
			nEast = placeArgs["bounds"]["northEast"]
		if 'bounds' in placeArgs:
			sWest = placeArgs["bounds"]["southWest"]
		place = placeArgs["name"]
	else: 
		nEast = placeArgs["northEast"]
		sWest = placeArgs["southWest"]
		place = None
	return Boundaries(nEast, sWest, place)

def processPolygon(polygonArgs):
	return "nothing"

def processArea(areaArgs):
	center[0] = areaArgs["lat"]
	center[1] = areaArgs["long"]
	radius = areaArgs["radius"]
	radiusFormat = areaArgs["format"]
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

def processPolice(policeArgs):
	print policeArgs
	category = policeArgs["category"]
	if 'date' in policeArgs <= police.lastUpdated():
		someDate = policeArgs["date"]
	else:
		someDate = police.lastUpdated()
		"""
		someDate = date.today() - timedelta(months=2)
		someDate = str(someDate.year)+"-"+str(someDate.month)
		"""
	if 'location' in policeArgs:
		location = locationOptions[policeArgs["location"]["type"]](policeArgs["location"])
	else:
		raise Exception("The request must include a location to get data from")

	#bounds = police.getBoundary()
	#neigh = police.getNeighbourhoods('hampshire').read()
	#boundry =  police.getBoundary('hampshire', 'Fair Oak').read()
	#crimes= police.getCrimes('all-crimes', 52.629729, -1.131592, '2014-09').read()
	crimesArea = police.getCrimesInAreaData(category, location.getSquareLatitudes(), location.getSquareLongitudes(), someDate)
	#return "NEIGHBOURHOOD"+"*"*10+"\n"+neigh+"BOUNDRY"+"*"*10+"\n"+boundry+"crimes"+"*"*10+"\n"+crimes+"crimesArea"+"*"*10+"\n"+crimesArea
	parsed = parser.parseCrimes(crimesArea)
	return parsed

def processWeather(weatherArgs):
	print weatherArgs

def processRestaurants(restaurantArgs):
	if 'location' in restaurantArgs:
		location = locationOptions[restaurantArgs["location"]["type"]](restaurantArgs["location"])
	else:
		location = None

	if 'name' in restaurantArgs:
		name = restaurantArgs["name"]
	else:
		name = None

	if name is None:
		jsonData = foodstandartsagency.searchLoc(location.locationName)
	elif location is None:
		jsonData = foodstandartsagency.searchName(name)
	else:
		jsonData = foodstandartsagency.searchNameLoc(name, location.locationName)

	collection = parser.parseFSA(jsonData)
	return collection

def processAirquality(airqualityArgs):
	collection=None
	jsonData = airquality.getData()
	collection = parser.parseAirQuality(jsonData)
	return collection

def processHouseListing(houseArgs):
	if 'location' in houseArgs:
		location = locationOptions[houseArgs["location"]["type"]](houseArgs["location"])
	else:
		raise Exception( "Location not specified")
	jsonData = ''
	if isinstance(location, Boundaries):
		jsonData = houses.getListing(location.locationName, location.formattedOutput())
	elif isinstance(location, CircleArea):
		jsonData = houses.getListing(None, location.formattedOutput())

	collection = parser.parseHouseListing(jsonData) 

	return collection

'''
"args": {
            "location": {
            	"type": "place",
                "name": "CityName"
	        }
            "gender": "Boys/Girls/Mixed"
            "phase": "Primary/Secondary"
            "capacity": ["More/Less/Equal", 1]
    	}
'''
def processSchools(schoolArgs):
	if 'location' in schoolArgs:
		location = locationOptions[schoolArgs["location"]["type"]](schoolArgs["location"])
	else:
		raise Exception( "Location not specified")

	try:
		gender = schoolArgs["gender"]
		if gender not in ['Boys', 'Girls', 'Mixed']:
			raise InvalidValue("Value: " + gender + " for gender is not valid")
	except Exception as e:
		if type(e) is InvalidValue:
			raise
		else:
			gender = False

	try:
		phase = schoolArgs["phase"]
		if phase not in ['Primary', 'Secondary']:
			raise InvalidValue("Value: " + phase + " for phase is not valid")
	except Exception as e:
		if type(e) is InvalidValue:
			raise
		else:
			phase = False

	try:
		capacity = schoolArgs["capacity"]
		if capacity[0] not in ['More', 'Less', 'Equal']:
			raise InvalidValue("Value: " + capacity[0] + " for capacity is not valid")
	except Exception as e:
		if type(e) is InvalidValue:
			raise
		else:
			capacity = False

	jsonData = schools.buildURL([location.locationName, capacity, gender, phase])
	collection = parser.parseSchoolData(jsonData)
	return collection