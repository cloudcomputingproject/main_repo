"""
Request Handler

"""
import urllib2
import json
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError
from flask import request, render_template, flash, url_for, redirect, Blueprint, json, jsonify
from flask_cache import Cache

from application.decorators import login_required, admin_required
from application.forms import ExampleForm

from application import app

from application.controller import controller


# Flask-Cache (configured to use App Engine Memcache API)
cache = Cache(app)
 
handler = Blueprint('handler', __name__)

'''
ideally, the request_handler accepts POST requests, extract the data in the POST requst,
calls the controller method which returns the JSON object which the client expect,
and then finally, send the result(the json) back to the client
'''
'''
body of the request has to contain JSON object with the following schema:
{ "selection" : "name"
  "features" : {"name" : "feature_name"},
  "location" : "Some location name or null",
  "area" : [coordinates in here],
  "radius" : {"lat" : "1", "long": "1", "radius": "in kilometers"}
}
'''

@handler.route('/app/allData', methods=['POST'])
def handleAllDataReq():
	response = "There was an error"
	print "***************"
	print "*** REQUEST ***"
	print "***************"
	try:
		input_data = request.data
		input_data = json.loads(input_data)	

		if 'geoCoding' in input_data : 
			response1 = controller.getGeoCoding(input_data["geoCoding"])
			response = "{ \"geoCoding\": %s}" % (response1)
		elif  'geoJSON' in input_data:
			response2 = controller.main(input_data["geoJSON"])
			response = "{\"geoJSON\": %s}" % (response2)

		# if ('geoCoding' in input_data) & ('geoJSON' in input_data):
		# 	response1 = controller.getGeoCoding(input_data["geoCoding"])
		# 	response2 = controller.main(input_data["geoJSON"])
		# 	response = "{ \"geoCoding\": %s, \"geoJSON\": %s}" % (response1,response2)
		# elif 'geoCoding' in input_data :
		# 	response1 = controller.getGeoCoding(input_data["geoCoding"])
		# 	response = "{ \"geoCoding\": %s}" % (response1)
		# elif  'geoJSON' in input_data:
		# 	response2 = controller.main(input_data["geoJSON"])
		# 	response = "{\"geoJSON\": %s}" % (response2)

		#response = controller.main(input_data);

		print "****"
		print "****"
		print "****"		
		#response["geoCoding"] = response1
		#response["geoJSON"] = response2
		#response = "all good"
		#response = json.dumps({"geoCoding" : response1, "geoJSON" : response2});
	except Exception, e:
		response = str(e),400
		print response
	except ValueError as e:
		response = str(e),200
		print response 
	finally:
		print "****"
		print response
		return response;

@handler.route('/app/geo', methods=['POST'])
def handleGeoLocReq():
	response = "There was an error"
	try:
		input_data = request.data
		input_data = json.loads(input_data)	
		response = controller.getGeoCoding(input_data)
	except Exception, e:
		response = str(e),400
		print response
	except ValueError as e:
		response = str(e),400
		print response	
	finally:
		return response
	

@handler.route('/app/', methods=['POST'])
def handleDataReq():
	#extract the data sent from the client
	#the POST request's body should contain a key-value pair and the name of the key is 'data'
	
 	
 	response = "There was an error"
	try:
	
		print "inside POST request handler"
		input_data = request.data
		print "data received ",input_data
		input_data = json.loads(input_data)	
		response = controller.main(input_data)

	except Exception, e:
		response = str(e),400
		print response
	except ValueError as e:
		response = str(e),400
		print response	
	finally:
		return response



