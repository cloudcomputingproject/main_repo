// A controller for the API Handlers.
// The functions implemented here handle the events in the Control panel of the map,
// extract data from the Control panel, and send a request to the server.
// Use this to make the request to the server.
// The code below uses the Module Pattern (http://toddmotto.com/mastering-the-module-pattern/).

var DataHandler = (function() {

	// Make a request to the server and gets the response
	// @cb -  callback, the APIHandler passes this function 
	// @err - callback, handles errors
	var makeRequest = function(post_data, cb, err){
 
		console.log('controller sending request to the model, request data:');
		console.log(post_data);
		Model.query(post_data, cb, err);
	};

	var default_err = function(error){
		// Invoke default error action.
		console.log('Default error handler: Error message: ' +error)
		showError(error);
		disable_preloader();
	};

	var handle_response = function(data){
		console.log('handle_respnse data:')
		console.log(data)
		// If this method is executed, it means the Model returned a valid response
		// (containing valid data).
		// So, delegate it to the view to handle and
		// set the checkbox to checked for the given API.
		var response_data = getResponseData(data);
		var response_api = getResponseApi(data);
		console.log(response_data)
		console.log(response_api)
		View.handle(data, response_api);
		disable_preloader();
		console.log('All visualised')
		console.log(Date.now())
 
	};

 
	var getLocation = function(api){
		// Check if we are in Search city mode or Draw area mode.
		var location = {};
		if (isSearchCityTabActive(api)) {
			location.type = 'place';
			location.name = getSearchCityText(api);
			if(!location.name) {
				console.log(api + " empty city name");
				return undefined;
			}
 		} else if (isDrawAreaTabActive(api)) {
			var coord = getDrawCoordinates();
			if (coord === undefined){
				console.log(api + " empty draw coordinates");
				return undefined;
			}
			location.type = coord.geometry.type.toLowerCase();
			switch (location.type) {
				case 'polygon':
					var polygon = polygonLayerToPolygon(getRawLayer());
					return polygon;
				case 'circle':
					var circle = circleLayerToCircle(getRawLayer());
					return circle;
				case 'rectangle':
					var rectangle = rectangleLayerToRectangle(getRawLayer());
					return rectangle;
				default:
					console.log('Cannot determine type of Draw ');
					return undefined;
			}
 		} else if (isMixedSearchActive(api)) {
 			location.type = 'place';
			location.name = getMixedSearchText(api);
			if (!location.name){
				console.log(api + " empty mixed search field");
				return undefined;
			}
		} else if (isAllUkTabActive(api)){
			location.all = true;
		}
		else {
			return undefined;
		}
		return location;
	};
	
	var module = {
		makeRequest: makeRequest, 
		defaultErrorCallback: default_err,
		handle_response: handle_response,
		getLocation: getLocation
	};
	return module;
})();


 var PoliceHandler = (function(DataHandler){
 	// Get the data and send it.
 	var api  = 'police';
	var handle = function() {
		var data = constructRequestObject();
		// Send the data to the server and receives the response.
		DataHandler.makeRequest(data, handle_police_response, DataHandler.defaultErrorCallback); 
	};
	
	/* Private methods */

	// This method is called when the server has returned the data to be visualised.
	var handle_police_response = function(response){
		// this is the default action
		DataHandler.handle_response(response);
		
		//add police specific controller actions here
		
	};

 	// This method gets the input from the Control panel
	// and adds it to the data object.
	var constructRequestObject = function() {
		// Add all the data to the object.
		var request = {};
		request['name'] = api;

		var data = {};
		data.category = getCrimeCategory();
		if(data.category.length === 0){
			alert('Please select Police Crime category');
			return undefined;
		}
		var date = getApiDate(api);
		if(!date){
			alert("Please select Police date");
			return undefined;
		}
		data.date = date;
		data.location = DataHandler.getLocation(api);
		if(data.location === undefined) return undefined;
		request.args = data;
		return request;
	};

	// Returns the selected categories of crime.
	 var  getCrimeCategory = function(){
	 	var cats = [];
	 	$(".police_collapsable_1").each(function(index){
	 		if($(this).is(':checked')){
	 			cats[index] = $(this).attr('id');
	 		}
	 	});
	 	return cats;
	};
 
	var module = {handle: handle};
	return module;
})(DataHandler);

var RestaurantHandler = (function(DataHandler){
 
 	var api  = 'restaurant';

 	//get the data and send it
	var handle = function() {
		var data = constructRequestObject();
	 	DataHandler.makeRequest(data, handle_restaurant_response,DataHandler.defaultErrorCallback);
	};
	//private methods to RestaurantHandler

	var handle_restaurant_response = function(response){
		DataHandler.handle_response(response);
 	};

 	//this method gets the input from the Control panel
	//and adds it to the data object 
	var constructRequestObject = function() {
		//add all the data to the object
		var request = {};
		request.name = api;

		var data = {};
		data.location = DataHandler.getLocation(api);
		if(data.location ===undefined) return undefined;

		request.args = data;
		return request;
	};


	//returns the selected categories of crime


	var module = {handle: handle};
	return module;
})(DataHandler);




var AirqualityHandler = (function(DataHandler){
	var api = 'airquality';
	
	var handle = function (){
		var data = constructRequestObject();
		DataHandler.makeRequest(data, handle_airquality_response, DataHandler.defaultErrorCallback);
	};
	
	var handle_airquality_response = function(response){
		DataHandler.handle_response( response);
	};

	var constructRequestObject = function(){
		var data = {};
		data.name = api;
		return data;
	};
	
	var module = {handle: handle};
	
	return module;
})(DataHandler);


var HousesHandler = (function(DataHandler){
	var api = 'house';
	
	var handle = function (){
		var data = constructRequestObject();
		DataHandler.makeRequest(data, handle_houses_response,DataHandler.defaultErrorCallback);
	};
	
	var handle_houses_response = function(response){
		DataHandler.handle_response( response);
	};

	var constructRequestObject = function(){
		var request = {};
		var data = {};
		request.name = api;
		data.location = DataHandler.getLocation(api);
		if(!data.location) {
			return undefined;
		}
		data.listing_type = getDropdownValue(api, 'listing_type');
		request.args = data;
		return request;
	};
	
	var module = {handle: handle};
	
	return module;
})(DataHandler);
var SchoolsHandler = (function(DataHandler){
	var api = 'schools';
	
	var handle = function (){
		var data = constructRequestObject();
		DataHandler.makeRequest(data, handle_schools_response,DataHandler.defaultErrorCallback);
	};
	
	var handle_schools_response = function(response){
		DataHandler.handle_response( response);
	};

	var constructRequestObject = function(){
		var request = {};
		var data = {};
		request.name = api;
		data.location = DataHandler.getLocation(api);
		if(!data.location) {
			return undefined;
		}
		data.gender = getDropdownValue(api, 'gender_type');
		data.phase = getDropdownValue(api, 'education_phase');
		data.capacity = false;
		request.args = data;
		return request;
	};
	
	var module = {handle: handle};
	
	return module;
})(DataHandler);


var GeoCodingHandler = (function(DataHandler){
 	
 	var api  = 'geocoding';

 	// Get the data and send it.
	var handle = function(){
		console.log("~~~ handling geocoding");
		var data = constructRequestObject();
		if(data === undefined) {
			console.log('cannot construct request data object');
			return;
		}
		// Send the data to the server and receive the response.
		DataHandler.makeRequest(data,handle_geoCoding_response, DataHandler.defaultErrorCallback);
	};
	
	/* Private methods */

	// This method is called when the server has returned the data.
	var handle_geoCoding_response = function(response){
		console.log("====== > handle_geoCoding_response");
		console.log(response);
		// This is the default action.
		if (map){
			zoomTo(getCenter(response["data"]),DEFAULT_ZOOM+5);      
		}else{
			init();
		}
	};

 	// This method gets the input
	// and adds it to the data object 
	var constructRequestObject = function() {
		// Add all the data to the object
		var request = {};
		var data = {};
		request.name = 'geocoding';

		var locationName = $("#location").val();
		if(locationName === "") return undefined;
		data.location = {'type':'place', 'name':locationName};
		request.args = data;
		return request;
	};

	var getCenter = function(json){
		console.log("~~~");
		console.log(json);
		console.log("~~~");
	 	var centerLocation = L.latLng(json["data"]["results"][0]["geometry"]["location"]["lat"],
                           json["data"]["results"][0]["geometry"]["location"]["lng"]);
	 	return centerLocation;
	};

	var getBounds = function(json){
		bounds = undefined;
	 	if (L.latLng(json["data"]["results"][0]["geometry"]["bounds"])){
            var northEast = L.latLng(json["data"]["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
                         json["data"]["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
            var southWest = L.latLng(json["data"]["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
                           json["data"]["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);
            bounds = L.latLngBounds(southWest, northEast);
        }
        return bounds;
	};
	
	var getZoomLocationName = function(){
	 	var name = $("#location").val();
	 	return name;
	};

	var module = {handle: handle};
	return module;
})(DataHandler);


// Register all data handlers here, the keys should match the
// API categories coming from the server.
var DataHandlerMapper = {
	'police': PoliceHandler,
	'restaurant': RestaurantHandler,
	'geoCoding': GeoCodingHandler,
	'airquality': AirqualityHandler,
	'schools': SchoolsHandler,
	'house': HousesHandler

};