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
'geocoding' : 2 
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











