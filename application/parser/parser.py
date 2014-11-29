from flask import json, jsonify

def parsePoliceCategories(categStr):
	catArr = json.load()
	categories = []
	for holder in catArr:
		categories.push(holder["name"])
	return json.dump(categories)

