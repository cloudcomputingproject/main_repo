from flask import json, jsonify
from geojson import Feature, Point, FeatureCollection
from application.api import external_api
from application.api.servers import geocoding
from application.controller.exceptions import GeocodingLimitException
import re


def parsePoliceCategories(categStr):
	catArr = json.loads(categStr)
	categories = []
	for holder in catArr:
		categories.append(holder["name"])	

	return categories#json.dumps(categories, separators=(',',':'))


def parsePoliceCategoriesWithUrlName(categStr):
	catArr = json.loads(categStr)
	categories = []
	for holder in catArr:
		categories.append([holder['url'], holder['name']])

	return categories

def parseCrimes(jsondata):
	crimesOld = json.loads(jsondata)
	#feature/dynamic_map_control
	features = [];
	for crime in crimesOld:
		lat =  crime["location"]["latitude"]
		lng =  crime["location"]["longitude"]
		point = Point((float(lng),float(lat)))
		category = crime["category"]
		out_stat = crime["outcome_status"]
		properties = {'category':category,'outcome_status':out_stat}
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc

def parseAirQuality(jsondata):
	data = json.loads(jsondata)
	features = []

	for item in data:
		title = item['title']
		description = str(item['description'])
		
		indexBegin = description.index(':')+2
		indexEnd = description.index('&')
		lat = int(description[indexBegin:indexEnd])
		
		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('&',indexBegin)
		lat += int(description[indexBegin:indexEnd])*0.01
		
		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('.',indexBegin)
		lat += int(description[indexBegin:indexEnd])*0.0001

		indexBegin = description.index('deg',indexEnd)-2
		indexEnd = indexBegin+1
		lng = int(description[indexBegin:indexEnd])

		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('&',indexBegin)
		lng += int(description[indexBegin:indexEnd])*0.01
		
		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('.',indexBegin)
		lng += int(description[indexBegin:indexEnd])*0.0001
		
		directionIndex = description.index(';',indexEnd)+1
		if description[directionIndex] == 'W':
			lng *= -1

		if description[-1:] == 'a':
			pollutionLevel = -1
		else:
			pollutionLevel = int(description[-1:])

		point = Point((lng, lat))
		properties = {'title':title,'pollutionLevel':pollutionLevel}
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc

def parseFSA(jsondata):
	data = json.loads(jsondata)
	features = []

	for item in data:
		name = item['BusinessName']
		lat = item['Geocode']['Latitude']
		lng = item['Geocode']['Longitude']
		if type(item['Scores']['Hygiene']) is not dict:
			hygiene = item['Scores']['Hygiene']
			mang = item['Scores']['ConfidenceInManagement']
			structural = item['Scores']['Structural']
		else:
			hygiene = 'N/A'
			mang = 'N/A'
			structural = 'N/A'
		#took this approach for pragmatism, some of the data of FSA is corrupt and they send null fields, since there is no point keeping a place that we don't know where it is, I simply ignore it
		try:
			point = Point((float(lng), float(lat)))
		except:
			continue
		properties = {'name':name,'hygiene':hygiene,'management':mang,'structural':structural}
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc

def parseHouseListing(jsondata):
	data = json.loads(jsondata)
	features = []

	for item in data:
		lat = item.get('latitude')
		lng = item.get('longitude')
		title = item.get('title')
		price = item.get('price')
		currency = item.get('price_currency')
		bedroomN = item.get('bedroom_number')
		bathN = item.get('bathroom_number')
		img_height = item.get('img_height')
		img_width = item.get('img_width')
		img_url = item.get('img_url')
		price_type = item.get('price_type')
		property_type = item.get('property_type')
		summary = item.get('summary')
		point = Point((lng, lat)) #this needs to be this way, the other way arround makes UK be Somalia, and we don't want that, do we?
	#properties = json.dumps({'price':price,'currency':currency,'bedroomNumber':bedroomN,'bathNumber':bathN,'lastUpdated':lastUpdated})
		properties = {'title':title, 'price':price,'currency':currency,'bedroomNumber':bedroomN,'bathNumber':bathN, 'img_height':img_height, 'img_width':img_width, 'img_url':img_url, 'price_type':price_type, 'property_type':property_type, 'summary':summary} #seems like Feature class is clever enough to turn the object into json itself ;)
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc
'''
Parses the received school data. Receives a list of JSON objects for each school
'''
def parseSchoolData(listdata):
	features = []
	data = json.loads(listdata)
	# for each school
	for item in data:
		#data = json.loads(item)

		# Because not every school provides all types of data, if some data is unavailable a blank space is used
		name = ' '
		if 'label' in item:
			name = item['label']

		typeOfEst = ' '
		if 'typeOfEstablishment' in item:
			typeOfEst = item['typeOfEstablishment']['label']

		phase = ' '
		if 'phaseOfEducation' in item:
			phase = item['phaseOfEducation']

		capacity = ' '
		if 'schoolCapacity' in item:
			capacity = item['schoolCapacity']

		gender = ' '
		if 'gender' in item:
			gender = item['gender']['label']

		religiousChar = ' '
		if 'religiousChar' in item:
			religiousChar = item['religiousCharacter']['label']

		# each school's address in JSON format, uses a helper function to find the coordinates
		try:
			coordinates = getSchoolCoordinate(item['address'])
		except GeocodingLimitException as e:
			print 'Geocoding Limit Reached'
			continue
		lat = coordinates['lat']
		lng = coordinates['lng']

		prefEmail = ' '
		if 'prefEmail' in item:
			prefEmail = item['prefEmail']

		altEmail = ' '
		if 'altEmail' in item:
			altEmail = item['altEmail']

		point = Point((lng, lat))
		props = {'name':name, 'type_of_establishment':typeOfEst, 'phase_of_education':phase, 'capacity':capacity, 'gender':gender, 'religious_character':religiousChar, 'preferred_email':prefEmail, 'alternative_email':altEmail}
		feature = Feature(geometry=point, properties=props)
		features.append(feature)

	fc = FeatureCollection(features)
	return fc

# Receives a JSON object with the address, builds a string from it and uses the geocoding API to get the coordinates
def getSchoolCoordinate(jsonAddress):

	#Again, not all keys are always given, so we need to check
	address = ''

	if 'address1' in jsonAddress:
		address = address + jsonAddress['address1'] + " "

	if 'address2' in jsonAddress:
		address = address + jsonAddress['address2'] + " "
	
	if 'postcode' in jsonAddress:
		address = address + jsonAddress['postcode'] + " "

	if 'town' in jsonAddress:
		address = address + jsonAddress['town']

	#All spaces in the string need to be replaced with a '+' char for the geocoding API
	address = re.sub(' ', '+', address)
	geocode = geocoding.getData(address)

	geo = json.loads(geocode)
	if 'error_message' in geo:
		raise GeocodingLimitException("Geocoding limit reached")
	else :
		coordinates = geo['results'][0]['geometry']['location']
		return coordinates
