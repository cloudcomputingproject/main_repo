"""
gLoginTest.py
google login view, test file, not final version
"""

import random
import string

# OAuth api imports
import httplib2
from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError

from simplekv.memory import DictStore
from flaskext.kvsession import KVSessionExtension

# APP imports
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError
from flask import request, render_template, flash, url_for, redirect, Blueprint, json, Flask, make_response, request, session
from flask_cache import Cache
from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel
from application.controller import controller
from application import app

# Flask-Cache (configured to use App Engine Memcache API)
cache = Cache(app)

googleLogin = Blueprint('glogintest', __name__)

@googleLogin.route('/glogintest')
def googlebutton():
	return render_template('glogin/glogintest.html')