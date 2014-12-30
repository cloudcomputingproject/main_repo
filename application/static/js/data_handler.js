//the functions implemented here handle the events in the Control panel of the map,
//extracts the data from the Control panel, and send a request to the server.
//use this to make the request to the server
//the code below uses the Module Pattern (http://toddmotto.com/mastering-the-module-pattern/)

//register all data handlers here, the keys should match the
//api categories coming from the server


var DataHandler = (function(){
	//make a request to the server and gets the response
	var getResponse = function (post_data){
		if(post_data === undefined){
			$('#alert_empty_draw').show();
			return;
		}
		//TO DO send the actual request.
		console.log('sending the data');
		console.log(post_data);
	};
	//TO DO change d to data so we use the data from the server
	//and not the default one	
	var handle_response = function(layer, data){
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
		if(isSearchCityTabActive(api)){
			result.name = getSearchCityText(api)
			return result;
		}
		else if(isDrawAreaTabActive(api)){
			var coord = getDrawCoordinates();
			if (coord === undefined){
				return undefined;
			}
			result.area = coord;
			return result;
		}else{
			return undefined;
		}
	};
	var  checkIfDataHasExpired = function(name){
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
		var response = DataHandler.getResponse(data); //this sends the data to the server and receives the response

		//handle server response
		handle_police_response(response);
	}
	
	//private methods to PoliceHandler

	//this method is called when the server has returned the data to be visualised
	var handle_police_response = function(response){
		//this is the default action
		DataHandler.handle_response('police', data);
		
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
		var response = DataHandler.getResponse(data);
		handle_restaurant_response(response);
	}
	//private methods to RestaurantHandler

	var handle_restaurant_response = function(response){
		DataHandler.handle_response('restaurant',data2);
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
		var response = DataHandler.getResponse(data);
		handle_weather_response(response);
	};
	//private methods to WeatherHandler

	var handle_weather_response = function(response){
		DataHandler.handle_response('weather' , response);

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

var DataHandlerMapper = {
	'police': PoliceHandler,
	'restaurant': RestaurantHandler,
	'weather': WeatherHandler
};