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
		'policeCategories': controller.getPoliceCategories()
		# 'policeCategories': controller.getPoliceCategories()
	}
	dataToSend = json.dumps(dataToSend,separators=(',', ':'))
	return render_template('home/home.html', dataToSend=dataToSend)

# this returns the html for the Control of the map
@home.route('/app/control_panel')
def control_panel():
	policeCategories = controller.getPoliceCategories()
	newList = [x.replace(' ', '_') for x in policeCategories]
 	template_data = {
	'all_api_categories':controller.getCategoriesAPI(),
	'policeCategories': policeCategories
	}
	return render_template('map_control/main.html', template_data = template_data)

@home.route('/<page_name>')
def renderPage(page_name):
    return render_template(page_name+'.html')
# @home.route('/500')
# def render500():
#     return render_template('500.html')
# @home.route('/base')
# def renderBase():
#     return render_template('base.html')
# @home.route('/edit_example')
# def renderEdit_ex():
#     return render_template('edit_example.html')
# @home.route('/edit_example')
# def renderEdit_ex():
#     return render_template('edit_example.html')
# def say_hello(username):
#     """Contrived example to demonstrate Flask's url routing capabilities"""
#     return 'Hello %s' % username


# @login_required
# def list_examples():
#     """List all examples"""
#     examples = ExampleModel.query()
#     form = ExampleForm()
#     if form.validate_on_submit():
#         example = ExampleModel(
#             example_name=form.example_name.data,
#             example_description=form.example_description.data,
#             added_by=users.get_current_user()
#         )
#         try:
#             example.put()
#             example_id = example.key.id()
#             flash(u'Example %s successfully saved.' % example_id, 'success')
#             return redirect(url_for('list_examples'))
#         except CapabilityDisabledError:
#             flash(u'App Engine Datastore is currently in read-only mode.', 'info')
#             return redirect(url_for('list_examples'))
#     return render_template('list_examples.html', examples=examples, form=form)


# @login_required
# def edit_example(example_id):
#     example = ExampleModel.get_by_id(example_id)
#     form = ExampleForm(obj=example)
#     if request.method == "POST":
#         if form.validate_on_submit():
#             example.example_name = form.data.get('example_name')
#             example.example_description = form.data.get('example_description')
#             example.put()
#             flash(u'Example %s successfully saved.' % example_id, 'success')
#             return redirect(url_for('list_examples'))
#     return render_template('edit_example.html', example=example, form=form)


# @login_required
# def delete_example(example_id):
#     """Delete an example object"""
#     example = ExampleModel.get_by_id(example_id)
#     try:
#         example.key.delete()
#         flash(u'Example %s successfully deleted.' % example_id, 'success')
#         return redirect(url_for('list_examples'))
#     except CapabilityDisabledError:
#         flash(u'App Engine Datastore is currently in read-only mode.', 'info')
#         return redirect(url_for('list_examples'))


# @admin_required
# def admin_only():
#     """This view requires an admin account"""
#     return 'Super-seekrit admin page.'


# @cache.cached(timeout=60)
# def cached_examples():
#     """This view should be cached for 60 sec"""
#     examples = ExampleModel.query()
#     return render_template('list_examples_cached.html', examples=examples)


# def warmup():
#     """App Engine warmup handler
#     See http://code.google.com/appengine/docs/python/config/appconfig.html#Warming_Requests

#     """
#     return ''


