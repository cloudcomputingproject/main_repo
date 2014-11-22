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
{ "location" : "Some location name or null",
  "features" : [{"name" : "feature_name","args" : {"arg_name":"value"}}
]
 }
'''

@handler.route('/app/', methods=['POST'])
def handleReq():
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
		print e
	except ValueError as e:
		response = str(e),400
		print e
	finally:
		return response



