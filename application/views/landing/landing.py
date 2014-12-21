"""
landing.py
landing page view
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
from application.views.home import home


# Flask-Cache (configured to use App Engine Memcache API)
cache = Cache(app)

landing = Blueprint('landing', __name__, static_folder='static', static_url_path='/static/landing')

@landing.route('/')
def homepage():
	print url_for('home.homepage')

	return render_template('landing/index.html', app_url = url_for('home.homepage'))
	# return render_template('landing/index.html')

 
