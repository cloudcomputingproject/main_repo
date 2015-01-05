"""
home.py
URL route handlers
"""
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint, json

from flask_cache import Cache



from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel
from application.controller import controller

from application import app


# Flask-Cache (configured to use App Engine Memcache API)
cache = Cache(app)

home = Blueprint('home', __name__)

@home.route('/app')
def homepage():
	#we send this to the template engine so the client receives some data straight 
	#away, without having to make consequetive requests 
	dataToSend = {
		'categoriesAPI': controller.getCategoriesAPI(),
		'policeCategories': controller.getPoliceCategoriesWithUrl()

		# 'policeCategories': controller.getPoliceCategories()
	}
	dataToSend = json.dumps(dataToSend,separators=(',', ':'))
	return render_template('home/home.html', dataToSend=dataToSend)

# this returns the html for the Control of the map
@home.route('/app/control_panel')
def control_panel():
	policeCategories = controller.getPoliceCategoriesWithUrl()
	all_categories = controller.getCategoriesAPI()
	# we dont want to visualise the geoGoding on the Map Control
	try:
		all_categories.remove('geocoding')
	except ValueError:
		pass
  	template_data = {
	'all_api_categories': all_categories,
	'policeCategories': policeCategories
	}
	return render_template('map_control/main.html', template_data = template_data)

@home.route('/<page_name>')
def renderPage(page_name):
    return render_template(page_name+'.html')
