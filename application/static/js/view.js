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
}
function initLayers(api_names){
	var result = {};
	api_names.forEach(function(api){
		result[api] = {};
		result[api].heatmap = createHeatmapEmptyLayer();
		result[api].markers = createMarkersEmptyLayer();
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
function removeDataFromLayer(api,layer_type){
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
		var marker_layer = layers[api].markers;
		map.removeLayer(marker_layer);
		layers[api].markers = createMarkersEmptyLayer();
		
		return true;
	} else if (layer_type === 'heatmap'){
		var heatmap_layer = layers[api].heatmap;
		heatmap_layer.setLatLngs([]);
		return true;
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
		} else{ // no custom view defined so just visualise on the map
			defaultViewHandler(response, api);
		}
	}
	//private methods
	var defaultViewHandler = function(data, api){
		var data_for_map= {};
		var render_mode = getRenderMode(api);
		//first wipe out the old data
		removeDataFromLayer(api, 'markers');
		removeDataFromLayer(api, 'heatmap');
		render_mode.forEach(function(mode){
			if(mode === 'markers'){
				var getMarkersData = data.getMarkersData; // get the function
				// use the Model method to retrieve the data suitable for Markers
				console.log(data)
				data_for_map = getMarkersData(data); 
				renderMarkersOnMap(data_for_map, api);

			} else if (mode === 'heatmap'){
				var getHeatmapData = data.getHeatmapData;
				data_for_map = getHeatmapData(data);
				console.log(data_for_map)
				renderHeatmapOnMap(data_for_map, api);
			} else{
				console.log('Render mode not specified');
				return;
			}
		});

	};


	var renderHeatmapOnMap = function(data, api){
		console.log('adding data to '+api+'\'s heatmap layer');

		var heatmap = layers[api].heatmap;
		heatmap.setLatLngs([]); //reset the state of the layer
		//add heatmap data. the heatmap will be colorod based 
		//on the number of markers. For other visualising way,
		//specify a custom view handler

		data.eachLayer(function(l){
			heatmap.addLatLng(l.getLatLng());
		});

 		map.fitBounds(data.getBounds());
		
	};
	var renderMarkersOnMap = function(data, api){
		var marker_cluster = new L.MarkerClusterGroup();
		console.log('adding data to '+api+'\'s markers layer');
		console.log(layers)
		var layer = layers[api].markers;
 		layer.addLayers(data); 
 		map.fitBounds(layer.getBounds());
	};


	//custom view handlers
	var housesViewHandler = (function(){
		//public method
		var handle = function(data){

		};
		//private method
		var module = {handle: handle} //houses
		return module;
	})();

	var geoCodingViewHandler = (function(){
		var handle = function(data){ 

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