//view
/*
This module represents the View.
The module has a single public funciton handleData, which is passed the 
response from the server and has to visualise it, based on the 
current settings of the app(e.g - has the user selected Heatmap + Markers in the Map Control
for the given API)
The data contains the geoJSON response from the server + getter methods 
for specific data format(Heatmap layer and Marker layer need different types of data)
If a given API requires custom viewing, the View takes this into considaration and
executes the custom API view handler
*/

//add default layers(marker and heatmap) for each api
var View;
var layers;

var initView = function(){
	layers = initLayers(getAPINames());
	View = initialiseView();
};
function initLayers(api_names){
	var result = {};
	api_names.forEach(function(api){
		result[api] = {};
		result[api].heatmap = {};
		result[api].markers = {};
	});
	
	return result;
}
function createMarkersEmptyLayer(){
		return new L.MarkerClusterGroup().addTo(map);
}
function createHeatmapEmptyLayer(){
 		return L.heatLayer([], { maxZoom: 12 }).addTo(map);
}
function getLayers(){
	return layers;
}
function getLayer(api, layer_type, md5){
	if(layers && layers[api] && layers[api][layer_type] && layers[api][layer_type][md5]){
		return layers[api][layer_type][md5]
	} else{
		return undefined; 
	}
}
function addLayer(api, layer_type, md5){
	if(layer_type === 'markers'){
		layers[api][layer_type][md5] = createMarkersEmptyLayer();
		return layers[api][layer_type][md5];
	} else if(layer_type ==='heatmap'){
		layers[api][layer_type][md5] = createHeatmapEmptyLayer();
		return  layers[api][layer_type][md5];
	}

}
function removeDataFromAllLayers(api){
	var all_heatmap_ids = Object.keys(layers[api]['heatmap']);
	all_heatmap_ids.forEach(function(id){
		//for each layer we want to remove it from the map
		var layer  = layers[api]['heatmap'][id];

		console.log(layer)
		if(layer && map.hasLayer(layer)){
			map.removeLayer(layer);
			layers[api]['heatmap'][id] = createHeatmapEmptyLayer();
		}
	});
	var all_marker_ids = Object.keys(layers[api]['markers']);
	console.log(all_marker_ids)
	all_marker_ids.forEach(function(id){
		//for each layer we want to remove it from the map
		var layer  = layers[api]['markers'][id];
				console.log(layer)

		if(layer && map.hasLayer(layer)){

			map.removeLayer(layer);
			layers[api]['markers'][id] = createMarkersEmptyLayer();
		}
	});
}
// function addLayer(api, layer_type)
function removeDataFromLayer(api,layer_type, md5){
	//check if layer exists 
	if(!(api in layers)){
		console.log('Trying to remove data from layer which is not in the layers collection ');
		return false;
	}
	//check if layer type exists
	if(!(layer_type in layers[api])){
		console.log('Trying to remove data from non existing layer type');
		return false;
	}

	if(layer_type === 'markers'){
		console.log(layers)

		// var marker_layer = layers[api]['markers'][md5];
		var marker_layer = getLayer(api, 'markers', md5);
		if(marker_layer){
			console.log(marker_layer)
			layers[api]['markers'][md5] = createMarkersEmptyLayer();
			map.removeLayer(marker_layer);
			return true;
		} else {
			//layer doesnt exist
			return false;
		}
		
	} else if (layer_type === 'heatmap'){
		// var heatmap_layer = layers[api]['heatmap'][md5];
		var heatmap_layer = getLayer(api,'heatmap', md5);
		if(heatmap_layer){
			heatmap_layer.setLatLngs([]);
			return true;
		} else{
			//layer doesnt exist
			return false;
		}
	} else{
		console.log("Non-supported layer type");
		return false;
	}

}

var initialiseView = function(){
	if(View) return View; //singleton

	var handle = function(response, api){
		if(!api){
			console.log("Unexpected - View cannot check for which API the data is");
			return;
		}
		if(api in customViews){
			customViews.api.handle(response, api);
		} else { // no custom view defined so just visualise on the map(using the defaultViewHandler)
			defaultViewHandler(response, api);
		}
	}
	//private methods
	var defaultViewHandler = function(data, api){
		var render_mode = getRenderMode(api);
		//first wipe out the old data
		var marker_layer_exists = removeDataFromLayer(api, 'markers', data.md5_of_request);
		var heatmap_layer_exists = removeDataFromLayer(api, 'heatmap', data.md5_of_request);
		addLabel(api, data.md5_of_request);
		render_mode.forEach(function(mode){
			if (mode === 'markers') {
				// use the Model method to retrieve the data suitable for Markers
				console.log(data);
				//create new layer for this data

				// data_for_map = getMarkersData(data); 
				renderMarkersOnMap(data, api);

			} else if (mode === 'heatmap'){
				console.log(data)
				renderHeatmapOnMap(data, api);
			} else{
				console.log('Render mode not specified');
				return;
			}
		});
	};


	var renderHeatmapOnMap = function(data, api){
		console.log('adding data to '+api+'\'s heatmap layer');
		// var json = getResponseData(data);
		var getHeatmapData = data.getHeatmapData;
		var json = getHeatmapData();
		
		var md5_of_request = data.md5_of_request;

		var heatmap = layers[api]['heatmap'][md5_of_request];
		var heatmap = getLayer(api, 'heatmap', md5_of_request);
		if(!heatmap){
			heatmap = addLayer(api, 'heatmap', md5_of_request);
		}  
		//add heatmap data. the heatmap will be colored based 
		//on the number of markers. For other visualising way,
		//specify a custom view handler

		json.eachLayer(function(l){
			heatmap.addLatLng(l.getLatLng());
		});

 		map.fitBounds(json.getBounds());
		
	};
	var renderMarkersOnMap = function(data, api){
		console.log('adding data to '+api+'\'s markers layer');
		console.log(layers)
		var md5_of_request = data.md5_of_request;
		var layer = layers[api]['markers'][md5_of_request];
		if(!layer){
			layer = addLayer(api, 'markers', md5_of_request);
		} 
		var getMarkersData = data.getMarkersData;
		var json = getMarkersData()
		if(json){
	 		layer.addLayers(json); 
	 		map.fitBounds(layer.getBounds());
		}
	};


	//custom view handlers
	var housesViewHandler = (function(){
		//public method
		var handle = function(data){
			console.log('House view custom View entered')
		};
		//private method
		var module = {handle: handle} //houses
		return module;
	})();

	var geoCodingViewHandler = (function(){
		var handle = function(data){ 
			console.log('geo coding cusomt viewer entered');
		}
		var module = {handle: handle};
		return module; //geocoding
	})();

	var customViews = {
		houses: housesViewHandler,
		geocoding: geoCodingViewHandler
	};

	var module = {handle: handle}; //View
	return module;
};
