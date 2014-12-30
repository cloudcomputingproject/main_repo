import urllib2
import json
import sys
sys.path.insert(0,'./xmltodict')
import xmltodict

from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError
from flask import request, render_template, flash, url_for, redirect, Blueprint
from flask_cache import Cache
from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel
from application import app

def getData():
	url = 'http://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml'

	f = urllib2.urlopen(url)
	xmldata = f.read()
	f.close()

	data = xmltodict.parse(xmldata)
	data = data['rss']['channel']['item']
	jsondata = json.dumps(data)

	return jsondata