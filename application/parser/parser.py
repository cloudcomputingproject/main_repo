from flask import json, jsonify
from geojson import Feature, Point, FeatureCollection

def parsePoliceCategories(categStr):
	catArr = json.load(categStr)
	print catArr
	categories = []
	for holder in catArr:
		categories.append(holder["name"])	

	return categories#json.dumps(categories, separators=(',',':'))


def parsePoliceCategoriesWithUrlName(categStr):
	catArr = json.load(categStr)
	categories = []
	for holder in catArr:
		categories.append([holder['url'], holder['name']])

	return categories

def parseCrimes(json):
	crimesOld = json.load(json)
	feature/dynamic_map_control
	features = [];
	for crime in crimesOld:
		lat =  crime["location"]["latitude"]
		lng =  crime["location"]["longtitude"]
		point = Point((lat,lng))
		category = crime["category"]
		context = crime["context"]
		out_stat = crime["outcome_status"]
		properties = json.dumps({'category':category,'context':context,'outcome_status':out_stat})
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc

def parseAirQuality(jsondata):
	data = json.loads(jsondata)
	features = [];

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
		properties = json.dumps({'title':title,'pollutionLevel':pollutionLevel})
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc

def parseFSA(jsondata):
	data = json.loads(jsondata)
	features = [];

	for item in data:
		name = item['BusinessName']
		lat = item['Geocode']['Latitude']
		lng = item['Geocode']['Longitude']
		hygiene = item['Scores']['Hygiene']
		mang = item['Scores']['ConfidenceInManagement']
		structural = item['Scores']['Structural']
		#took this approach for pragmatism, some of the data of FSA is corrupt and they send null fields, since there is no point keeping a place that we don't know where it is, I simply ignore it
		try:
			point = Point((float(lng), float(lat)))
		except:
			continue
		properties = json.dumps({'name':name,'hygiene':hygiene,'management':mang,'structural':structural})
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc

def parseHouseListing(jsondata):
	data = json.loads(jsondata)
	data = data['listings']
	features = [];
	
	for item in data:
		lat = item['latitude']
		lng = item['longitude']
		price = item['price']
		currency = item['price_currency']
		bedroomN = item['bedroom_number']
		bathN = item['bathroom_number']
		lastUpdated = item['updated_in_days']
		point = Point((lng, lat)) #this needs to be this way, the other way arround makes UK be Somalia, and we don't want that, do we?
	#properties = json.dumps({'price':price,'currency':currency,'bedroomNumber':bedroomN,'bathNumber':bathN,'lastUpdated':lastUpdated})
		properties = {'price':price,'currency':currency,'bedroomNumber':bedroomN,'bathNumber':bathN,'lastUpdated':lastUpdated} #seems like Feature class is clever enough to turn the object into json itself ;)
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	return fc
