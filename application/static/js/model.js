/*
	This module represents the Model. The application queries the Model using
	'request objects' and the Model ideally returns geoJSON.
	It stores the cached data(cached server responses) and retrieves data from the server when 
	needed. Data for each API is stored in the Model.
	The Model holds a collection in which the keys are the name of the 
	available api's, and the values are objects containing all data for 
	the given api
	The Model is being used by making a query to it by passing to it a 
	'request object'. The model checks in its cache if there is already a 
	response from the server for this request object and if there is, returns the data 
	from the server response. If there is nothing in the cache(or if the data is too old
	), the Model sends an ajax	request using the 'request object' to the server, 
	then puts the response to the cache	and return the response from the server to the 
	caller(the response is slightly modified before returning it to the caller, read below).

	One thing to note is that the module doesn't return only an object containing
	the geoJSON object which has been received from the server, but also adds 
	getter methods to this object.
	Currently when constructing the object which the Model stores,
	the geoJSON data is stored, and getters for Heatmap friendly data and 
	Marker-friendly data are added.
	This means that if needed it is possible to add extra custom getter methods
	which allow custom handling of the received data. 

*/
var error_msg = {
	empty_request: "The data passed to the query was empty",
	bad_response: "The data received cannot be interpreted",
	400: "The request object was not constucted properly"
};
 
var Model;

function initModel(){
	Model = initialiseModel(getAPINames());
}
var initialiseModel = function(api_names) {
	if(Model) return Model; //singleton
	//the only public function of the Model module.
	//it first checks the cache, if no data is available,
	//make ajax request.
	//@data - the request object
	//@cb - callback to pass the response to
	//@err - callback to pass error object if 
	//no response was retrieved from the server or the response was an Error one(4xx, 5xx, etc.)

	var query = function(request_object, cb, err){
 		if(!request_object){
			err(error_msg.empty_request);
		}
		//check cache if it has the response from request_object
		var response = Cache.getEntry(request_object);
		//the cache doesn't have the request_object response
		//so make the ajax request
		if (response === undefined) {
			makeRequest(request_object,modelResponseHandler,err, cb);
		} else{
			//the cache gave back a cached response so we are using it
			//instead of making an ajax call
			modelResponseHandler(request_object,response, cb,err);
		}
	};

	//change the response before sending it back to the caller.
	var modelResponseHandler = function(request, response, cb, err){
		//add it to the cache
		Cache.addEntry(request, response);
		//add getters to the response
		var adjusted_response = (function(data){
			var new_response = {};	
		
			var getHeatmapData = function(){
				//prepare @data for heatmap
				//if something goes wrong, do "return undefined"
				// console.log(L.geoJson)
				return L.geoJson(data.data);
			};
			var getMarkersData = function(){
				//prepare @data for markers
				//if something goes wrong, do "return undefined"
				//make array of markers
				var geojson = L.geoJson(data.data);
				var markers = [];
				var count = 1;
				geojson.eachLayer(function(l){
					if(count===1){
						console.log(l);
						count++;
					}
					var marker = L.marker(l.getLatLng());
					
					markers.push(marker);
				});
 
			 
				return markers;
			};

			new_response.data = data;
			new_response.getHeatmapData = getHeatmapData;
			new_response.getMarkersData = getMarkersData;
			//new_response contains the original response from the server
			//plus methods to get the data in desired formats
			return new_response;
		})(response);

		if(adjusted_response){
			//the callback with the adjusted response passed to it is called.
			cb(adjusted_response);
		} else{
			//getHeatMapData or getMarkersData couldnt parse
			//the response. something is wrong with the response.
			if(err){
				err(error_msg.bad_response);
			}else{
				console.log("error occured when parsing the response. no error function to handle the error.");
			}
		}
	};

 

	var Cache = (function(api_names){
		//on init
		//construct the cache data structure
		//cache example structure
		/*
			{
				'police': {
					'7580a3673a14b44c288bcfb7dfd18a15': { //this is a md5 hash of the request object
					data: request_object, 
					timestamp: 123456789 //when the data was added to the cache
				}
			}
		*/
		var cache = {};
		var MAX_CACHE_TIME = 600000; // 10minutes
		api_names.forEach(function(api_name){
			cache[api_name] = {};
		});
		cache.geoCoding = {};
		///////init complete

		//public methods
		var getEntry = function(request_object){

			var response = entryExists(request_object);
			if(response === undefined) return undefined;

			return response;
			
		};
		//adds request object to the cache
		//the function checks if the api of the object is existing in the cache
		//then makes md5 of the object 
		//checks if the entry doesn't exist already
		//	adds it if it doesnt exist already
		var addEntry = function(request_object, response){
			//check if there is defined field for the object
			//(make sure to allow only valid apis)
			var api = getAPIFromRequestObject(request_object);
			if(!(api in cache)){
				console.log('trying to add non valid API to cache');
				return undefined;
			}
			var md5_of_request = MD5(JSON.stringify(request_object));
			//check if request already in cache
			if(cache[api][md5_of_request]){
				//if already in the cache, we just ignore the request 
				return;
			} else{
				//doesn't exist in the cache, so add it
				var timestamp = Date.now();
				var entry = {};
				entry.data = response;
				entry.timestamp = timestamp;
				cache[api][md5_of_request] = entry;

				console.log("Added a new entry in "+api+'\'s cache');
				return;
			}
		};

		// private methods//

		var entryExists = function(request_object){
			var api = getAPIFromRequestObject(request_object);
			// console.log(api)
			if(!api) return undefined;
			//check if the given api was added on init of cache
			if(! (api in cache) ) {
				console.log(cache)
				console.log('trying to check cache for non valid API');
				return undefined;
			}

			var md5_of_request = MD5(JSON.stringify(request_object));
			var cached_response = cache[api][md5_of_request];

			//check if the api has this object
			if(!cached_response) {
				console.log("API cache doesn't have the entry for the request");
				return undefined;
			}
			console.log(cached_response)
			//check what is the timestamp of the object
			var timestamp = cached_response.timestamp;
			//check if the data is fresh enough
			if (ageOfTimestamp(timestamp) < MAX_CACHE_TIME) {
				console.log("Cache object is fresh enough");
				return cached_response.data;
			} else{
				//remove it from the cache
				delete cache[api][cached_response];
				console.log("Cache object is not fresh enough");
				return undefined;
			}
		};
		
		return {getEntry: getEntry, addEntry: addEntry};
	})(api_names);


	return {query: query};
};

//wrapper for the ajax request.
//accepts the request object(@data) and a callback function(@cb)
function makeRequest( request_object, modelResponseHandler, err, cb){
	enable_preloader();
	$.ajax({
	      type: "POST",
	      url: domain+'/app/allData',
	      dataType: "json",
	      contentType: "application/json",
	      data: JSON.stringify(request_object),

	      error: function(error){
	        console.log("Status: "+error.status + " " + error.statusText + ", Response: " + error.responseText);
	        if(error_msg[error.status]){
	        	err(error_msg[error.status]);
	        }else{
	        	err(error);
	        }
	        disable_preloader();
        	return;

	      },
	      success:  function(response){ 
	      	console.log('receiving the data');
			console.log(response);
			if(modelResponseHandler && cb){
		      	modelResponseHandler(request_object,response,cb,err); //data is the request object
			}else{
				console.log('No callback was specified to handle the response!');
			}
	      	disable_preloader();
	      }
	});
};