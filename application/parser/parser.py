from flask import json, jsonify
from geojson import Feature, Point

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
