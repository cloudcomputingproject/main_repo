import urllib2
import xml.etree.ElementTree as ET

"""
from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError

from flask import request, render_template, flash, url_for, redirect, Blueprint

from flask_cache import Cache

from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel

from application import app
"""
def getData():
	url = 'http://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml'

	files = urllib2.urlopen(url)
	data = files.read()
	files.close()

	

	print ET.parse(data)

getData()