
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

url = 'http://data.police.uk/api/'

def getData():
    global url
    #json object
    data = urllib2.urlopen(url)
    
    #for testing purposes
    #print json.load(data)
    
    url = 'http://data.police.uk/api/'
    return data


'''
[{"url":"all-crime","name":"All crime"},{"url":"anti-social-behaviour","name":"Anti-social behaviour"},{"url":"burglary","name":"Burglary"},
{"url":"robbery","name":"Robbery"},{"url":"vehicle-crime","name":"Vehicle crime"},{"url":"violent-crime","name":"Violent crime"},{"url":"other-crime","name":"Other crime"}]
'''

def getCategories():
    global url
    url += 'crime-categories?date=2011-08'
    return getData()

#Neighbourhoods must be lower case and the white spaces replaced with '-'
def getNeighbourhoods(county):
    global url
    url += county + '/neighbourhoods'
    return getData()

def getBoundary(county, nhood):
    global url
    url += county + '/' + getNeighbourhoodID(county, nhood) + '/boundary'
    return getData()

def getNeighbourhoodID(county, nhood):
    global url
    url+= county + '/neighbourhoods'
    data = json.load(urllib2.urlopen(url))
    
    for j in xrange(0, len(data)):
        if data[j]["name"] == nhood:
            return data[j]["id"]
#date must be in the format yyyy-mm
def getCrimes(category, lat, lng, date):
    global url
    url+='crimes-street/' + category + '?lat=' + str(lat) + '&lng=' + str(lng) + '&date=' + date
    return getData()
#all xs then all ys
def getCrimesInArea(category, latArr, lngArr, date):
    global url
    url+='crimes-street/' + category + '?poly='
    for j in xrange(0, len(latArr)):
        url+=str(latArr[j]) + ',' + str(lngArr[j]) + ':'
    url = url[:-1]
    url+='&date=' + date
    return getData()


#getCategories()
#getNeighbourhoodsData('hampshire')
#getBoundary('hampshire', 'Fair Oak')
#getCrimes('all-crimes', 52.629729, -1.131592, '2014-09')
#getCrimesInArea('all-crimes', [52.268, 52.794, 52.130], [0.543, 0.238, 0.478], '2014-09')
