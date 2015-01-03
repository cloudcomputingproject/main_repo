import urllib2
import json
import sys

from google.appengine.api import users
from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError
from flask import request, render_template, flash, url_for, redirect, Blueprint
from flask_cache import Cache
from application.decorators import login_required, admin_required
from application.forms import ExampleForm
from application.models import ExampleModel
from application import app
from application.api.servers.xmltodict import xmltodict

def getData():
	url = 'http://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml'

	f = urllib2.urlopen(url)
	xmldata = f.read()
	f.close()

	data = xmltodict.parse(xmldata)
	data = data['rss']['channel']['item']
	jsondata = json.dumps(data)

	#return jsondata

	data = json.loads(jsondata)
	for item in data:
		title = item['title']
		description = str(item['description'])
		
		indexBegin = description.index(':')+2
		indexEnd = description.index('&')
		lat = int(description[indexBegin:indexEnd])
		
		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('&',indexBegin)
		lat += int(description[indexBegin:indexEnd])*0.01
		
		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('.',indexBegin)
		lat += int(description[indexBegin:indexEnd])*0.0001

		indexBegin = description.index('deg',indexEnd)-2
		indexEnd = indexBegin+1
		lng = int(description[indexBegin:indexEnd])

		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('&',indexBegin)
		lng += int(description[indexBegin:indexEnd])*0.01
		
		indexBegin = description.index(';',indexEnd)+1
		indexEnd = description.index('.',indexBegin)
		lng += int(description[indexBegin:indexEnd])*0.0001
		
		directionIndex = description.index(';',indexEnd)+1
		if description[directionIndex] == 'W':
			lng *= -1

		if description[-1:] == 'a':
			pollutionLevel = -1
		else:
			pollutionLevel = int(description[-1:])
		
		point = Point((lng, lat))
		properties = {'title':title,'pollutionLevel':pollutionLevel}
		feature = Feature(geometry=point,properties=properties)
		features.append(feature)
	fc = FeatureCollection(features)
	print fc
