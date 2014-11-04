"""
external_api.py

"""
import urllib2
import json

from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint, json, jsonify

from flask_cache import Cache



from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel

from application import app

from servers import worldbank
from servers import geocoding
from servers import foodstandartsagency
from servers import police

# Flask-Cache (configured to use App Engine Memcache API)
cache = Cache(app)
 
external_api = Blueprint('external_api', __name__)

'''
to use the api you need to specify the external server that is being used and also 
pass the necessery parameters.
example request to the worldbank's api
localhost:8080/api/1/NY.GDP.MKTP.CD/date=2013/format=json

supported external servers, our corresponding method and the parameters it takes
1 worldbank - getWorldBankData()  params: dataType?date&format 
'''
servers = {
'worldbank' : 1,
'geocoding' : 2,
'foodstandartsagency' : 3,
'police' : 4
}

@external_api.route('/api/'+str(servers['worldbank'])+'/<dataType>/<date>/<format>')
# @external_api.route('/api/1/<dataType>/<date>/<format>')
def getWorldBankData(dataType, date, format):
	# result = worldbank.getData("NY.GDP.MKTP.CD", "date=2013", "format=json")
	result = worldbank.getData(dataType, date, format)
 	return jsonify(result)


# Converting addresses into geographic coordinates
@external_api.route('/api/'+str(servers['geocoding'])+'/<address>')
def getGeocodingData(address):
	result = geocoding.getData(address)
 	return jsonify(result)

# Gets data from the Food Standarts Agency
@external_api.route('/api/'+str(servers['foodstandartsagency'])+'/<name>/<location>/<format>')
def getFoodStandartsAgencyData(name, location, format):
	# result = foodstandartsagency.getData("spitfire", "southampton", "json")
	result = foodstandartsagency.getData(name, location, format)
	return jsonify(result)

#Gets the crime categories from the police api
@external_api.route('/api/'+str(servers['police']))
def getCrimeCategories():
        result = police.getCategories()
        return jsonify(result)

# Gets the neighbourhoods in a county from the police api
@external_api.route('/api/'+str(servers['police'])+'/<county>')
def getNeighbourhoods(county):
	result = police.getNeighbourhoods(county)
	return jsonify(result)

# Gets the boundary coordinates for a neighbourhood in a county
@external_api.route('/api/'+str(servers['police'])+'/<county>/<nhood>')
def getBoundary(county, nhood):
	result = police.getBoundary(county, nhood)
	return jsonify(result)

# Gets the crimes done in this location during that month from the police api
# The date must be a string in the format 'yyyy-mm'
@external_api.route('/api/'+str(servers['police'])+'/<category>/<lat>/<lng>/<date>')
def getCrimes(category, lat, lng, date):
	result = police.getCrimes(category, lat, lng, date):
	return jsonify(result)

# Gets the crimes done in this area during that month from the police api
# The date must be a string in the format 'yyyy-mm'
@external_api.route('/api/'+str(servers['police'])+'/<category>/<latArr>/<lngArr>/<date>')
def getCrimes(category, latArr, lngArr, date):
	result = police.getCrimes(category, latArr, lngArr, date):
	return jsonify(result)


