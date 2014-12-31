//the functions implemented here handle the events in the Control panel of the map,
//extracts the data from the Control panel, and send a request to the server.
//use this to make the request to the server
//the code below uses the Module Pattern (http://toddmotto.com/mastering-the-module-pattern/)

//register all data handlers here, the keys should match the
//api categories coming from the server

function makeRequest(data, cb){
	enable_preloader();
	$.ajax({
	      type: "POST",
	      url: domain+'/app/allData',
	      dataType: "json",
	      contentType: "application/json",
	      data: JSON.stringify(data),

	      error: function(err){
	        console.log("Status: "+err.status + " " + err.statusText + ", Response: " + err.responseText);
	        disable_preloader();

	      },

	      success:  function(json){ 
	      	console.log('reciving the data');
			console.log(json);
			if(cb){
		      	cb(json);
			}
	      	disable_preloader();
	      }
	});
}
var DataHandler = (function(){

	//make a request to the server and gets the response

	var getResponse = function (post_data, cb){
		if(post_data === undefined){
			// $('#alert_empty_draw').show();
			console.log('empty request object - cannot make request.');
			return;
		}
		//TO DO send the actual request.
		console.log('sending the data');
		console.log(post_data);
		makeRequest(data, cb);
		//TO DO send the actual request.

	};
	//TO DO change d to data so we use the data from the server
	//and not the default one	
	var handle_response = function(layer, data){
		//set the checkbox to checked for the given api
		setMainApiCategoryCheckbox(layer, true); //layer is the same as the name of the api so safe to use it.
		addDataToMap(layer, data);
	}
	var addDataToMap = function (layer, data){	
		layer = availableLayers[layer]; //get the MapBox layer
		if(!layer){
			console.log('layer not existing');
			return;
		}
		if(!data){
			console.log("data from server is empty");
			return;
		}
		layer.clearLayers();
		layer.addData(data); //add data to the layer
	}
	var getLocation = function(api){
		//check if we are in Search city mode or Draw area mode
		var result ={};
		if (isSearchCityTabActive(api)) {
			result.name = getSearchCityText(api)
			if(!result.name) {
				console.log(api + " empty city name");
				
				return undefined;
			}
 		}
		else if (isDrawAreaTabActive(api)) {
			var coord = getDrawCoordinates();
			if (coord === undefined){
				console.log(api + " empty draw coordinates");
				return undefined;
			}
			result.area = coord;
 		} else if (isMixedSearchActive(api)) {
			result.name = getMixedSearchText(api);
			if (!result.name){
				console.log(api + " empty mixed search field");

				return undefined;
			}
		} else if (isAllUkTabActive(api)){
			result.all = true;
		}
		else {
			return undefined;
		}
		return result;
	};
	var checkIfDataHasExpired = function(name){
	    //check if the data was set x minutes ago or less
	    var lastSet = cache[name]; //when the cache was last updated.
	    console.log('cache:' + lastSet);
	    if(lastSet < 0)  { //true if cache was never set
	        return true;
	    }
	    var now = Math.round(new Date().getTime() / 1000); // SECONDS since 1970
	    var ageOfData = now - lastSet;
	    //if the data is older than the maximum time we allow the data to be cached for
	    if(ageOfData <= MAX_CACHE_AGE){
	        return false;
	    } else{
	        return true;
	    }
	}
	var module = {
		getResponse: getResponse, 
		handle_response: handle_response,
		getLocation: getLocation, 
		checkIfDataHasExpired: checkIfDataHasExpired
	};
	return module;
})();



 var PoliceHandler = (function(DataHandler){
 
 	//get the data and send it
 	var api  = 'police';
	var handle = function(){
		var data = constructRequestObject();
		// if(data === undefined) {
		// 	console.log('cannot construct request data object');
		// 	return;
		// }
		DataHandler.getResponse(data, handle_police_response); //this sends the data to the server and receives the response

	}
	
	//private methods to PoliceHandler

	//this method is called when the server has returned the data to be visualised
	var handle_police_response = function(response){
		//this is the default action
		//TO-DO change the sampple 'data' to 'response'
		DataHandler.handle_response(api, data);
		
		//add police specific actions here
		
	}

 	//this method gets the input from the Control panel
	//and adds it to the data object 
	var constructRequestObject = function() {
		//add all the data to the object
		var data = new Object();

		data.crime_categories = getCrimeCategory();
		if(data.crime_categories.length === 0){
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
		return data;
	};


	//returns the selected categories of crime
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
	 	DataHandler.getResponse(data, handle_restaurant_response);
	}
	//private methods to RestaurantHandler

	var handle_restaurant_response = function(response){
		DataHandler.handle_response(api, data2);
		//weather specific handling
	}

 	//this method gets the input from the Control panel
	//and adds it to the data object 
	var constructRequestObject = function() {
		//add all the data to the object
		var data = new Object();

		data.location = DataHandler.getLocation(api);
		return data;
	};


	//returns the selected categories of crime


	var module = {handle: handle};
	return module;
})(DataHandler);

var WeatherHandler = (function(DataHandler){
  	
  	var api  = 'weather';

 	//get the data and send it
	var handle = function(){
		var data = constructRequestObject();
		DataHandler.getResponse(data,handle_weather_response);
		
	};
	//private methods to WeatherHandler

	var handle_weather_response = function(response){
		DataHandler.handle_response(api , response);

		//weather specific handling
	};


 	//this method gets the input from the Control panel
	//and adds it to the data object 
	var constructRequestObject = function() {
		//add all the data to the object
		var data = new Object();

		data.location = DataHandler.getLocation(api);
		return data;
	};


	var module = {handle: handle};
	return module;
})(DataHandler);


var AirqualityHandler = (function(DataHandler){
	var api = 'airquality';
	var handle = function (){
		var data = constructRequestObject();
		DataHandler.getResponse(data, handle_airquality_response);
	}
	var handle_airquality_response = function(response){
		DataHandler.handle_response(api, response);
	};

	//no data is required for the weather api
	var constructRequestObject = function(){
		var data = new Object();
		data.name = api;
		return data;
	}
	var module = {handle: handle};
	return module;
})(DataHandler);

var HousesHandler = (function(DataHandler){
	var api = 'houses';
	var handle = function (){
		var data = constructRequestObject();
		DataHandler.getResponse(data, handle_airquality_response);
	}
	var handle_airquality_response = function(response){
		DataHandler.handle_response(api, response);
	};

	var constructRequestObject = function(){
		var data = new Object();
		data.name = api;
		data.location = DataHandler.getLocation(api);
		if(!data.location) {
			
			return undefined;
		}
		return data;
	}
	var module = {handle: handle};
	return module;
})(DataHandler);


// ----------
// ----------
// ----------

var GeoCodingHandler = (function(DataHandler){
 
 	//get the data and send it
	var handle = function(){
		var data = constructRequestObject();
		if(data === undefined) {
			console.log('cannot construct request data object');
			return;
		}
		DataHandler.getResponse(data,handle_geoCoding_response); //this sends the data to the server and receives the response
		//handle server response
		//console.log(response);
		//handle_geoCoding_response(response);
	}
	
	//private methods

	//this method is called when the server has returned the data
	var handle_geoCoding_response = function(response){
		//this is the default action
		if (true) {
			if (map){
				zoomTo(getCenter(response["geoCoding"]),DEFAULT_ZOOM+5);      
			}else{
				init();
			}
		}
	}

 	//this method gets the input
	//and adds it to the data object 
	var constructRequestObject = function() {
		//add all the data to the object
		var locationName = $("#location").val();
		if(locationName === "") return undefined;
		//console.log(locationName);
		//locationName = JSON.stringify(locationName);
		var data = {
			"geoCoding":{
        		"name": locationName
    		}
		}
		//data["deoCoding"].name=getZoomLocationName
		return data;
	};

	var getCenter = function(json){
	 	var centerLocation = L.latLng(json["results"][0]["geometry"]["location"]["lat"],
                           json["results"][0]["geometry"]["location"]["lng"]);
	 	return centerLocation;
	};

	var getBounds = function(json){
		bounds = undefined;
	 	if (L.latLng(json["results"][0]["geometry"]["bounds"])){
            var northEast = L.latLng(json["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
                         json["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
            var southWest = L.latLng(json["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
                           json["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);
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

// ----------
// ----------
// ----------



var DataHandlerMapper = {
	'police': PoliceHandler,
	'restaurant': RestaurantHandler,
	'weather': WeatherHandler,
	'geoCoding': GeoCodingHandler,
	'airquality': AirqualityHandler,
	'houses': HousesHandler

};