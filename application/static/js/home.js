 /*
Initialise the map and all of its components
The control panel is initialised here.
 */
 // global variables
var DEFAULT_LOCATION = "United Kingdom";
var DEFAULT_ZOOM = 5;
var mapbox_access_token = 'pk.eyJ1IjoiY2hpcHNhbiIsImEiOiJqa0JwV1pnIn0.mvduWzyRdcHxK_QIOpetFg';

var map;
var availableLayers = new Object();
var MAX_CACHE_AGE = 600; //600sec = 10minutes
var cache = new Object();

var domain = document.location.origin;

//entry point for the front end logic
$(document).ready(function() {
	
	init(DEFAULT_LOCATION, DEFAULT_ZOOM);

	attachButtonListeners();

});

//get the coordinates for the initial location
//and then using them, set up the map,
//add it's ControlPanel,
//initialise the layers on the map,
//	and add default content to them(this is done by initLayer)
function init(locationName, zoomLevel){

	if (!map){

		$.ajax({
	    	type: "POST",
	    	url: domain+'/app/geo',
	    	dataType: "json",
	    	contentType: "application/json",
	    	data: JSON.stringify({"name": encodeURIComponent(locationName)}),
	    	success:  function(json){
	    
	        	// convert name to coordinates using /api/2/
	        	var centerLocation = L.latLng(json["results"][0]["geometry"]["location"]["lat"],
	                            json["results"][0]["geometry"]["location"]["lng"]);
	        	// Sitting bounds
	        	var northEast = L.latLng(json["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
	                         json["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
	        	var southWest = L.latLng(json["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
	                         json["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);
	        	bounds = L.latLngBounds(southWest, northEast);
	        
				//set up MapBox
				var options  = {
					centerLocation: centerLocation, 
					zoomLevel: zoomLevel					
				};
	        	setMap(options);

	        	// the Control Panel showing the different layers
	        	//(the method is defined in controls.js)
	        	addControlPanel(); 

	        	initLayers();
	        	testHeat() ;
	      	}
	    });
	}
}
function setMap(options){
	L.mapbox.accessToken = mapbox_access_token;
	map = L.mapbox.map('map').setView(options.centerLocation, options.zoomLevel);

	var mapLink1 = "tile.openstreetmap.org";
	var mapLink2 = "tiles.mapbox.com/v3/{id}"
	var tiles = L.tileLayer('http://{s}.'+mapLink1+'/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        id : 'examples.map-20v6611k'
		}).addTo(map);

}
//add to the map the layers based on the categories available(this comes from the server)
//then add the default content to the map and set the checkboxes on the control panel.
function initLayers(){
 
  	var serverData = getServerData(); //this is the data passed as a variable when rendering the template
  	var layerData = serverData['categoriesAPI']; //all the types of data we support
 
    //create layers
    //dictionary to store layer (name,reference) //map to store feature type : layers, which will later be used to filter information
    for (var i = 0; i < layerData.length; i++) {
        availableLayers[layerData[i]] = L.geoJson(false, {
        style: function (feature) {
              return feature.properties && feature.properties.style;
              },
            onEachFeature: onEachFeature,
            pointToLayer: drawFeature
        }).addTo(map);
        cache[layerData[i]] = -1; //init the cache for each layer
    }
 
    //make a request for the default data to be displayed
    //TO-DO make a request for the police data
    //add the data to the layers and show it
 
    //set the value of the checkboxes based on what data is initially visualised
    //so basically set the default checkboxes
}


//this function gets the data which is passed from the controller trhrouh the
//template engine.
//the data is attached to an html element attribute( the #map <div> in our case)
function getServerData(){
  var data = $('#map').data("fromserver");
  // console.log(x);
  return data;
}
var zoomTo = function(locationName, zoomLevel) {

	$.ajax({
      type: "POST",
      url: domain+'/app/allData',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(sampleRequest3),//locationName.replace(/\s/g, '%20')}),
      error: function(){
        console.log("fail >><< ");
      },
      success:  function(json){        
        bigJson = json;
        json = bigJson["geoCoding"];
        geoJSON = bigJson["geoJSON"];

        if (json){
          console.log("1:");
          console.log(json);
          console.log("2:");
          console.log(geoJSON);
          var centerLocation = L.latLng(json["results"][0]["geometry"]["location"]["lat"],
                           json["results"][0]["geometry"]["location"]["lng"]);

          // Bounds

          if (L.latLng(json["results"][0]["geometry"]["bounds"])){
            var northEast = L.latLng(json["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
                         json["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
            var southWest = L.latLng(json["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
                           json["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);

            bounds = L.latLngBounds(southWest, northEast);
          }

        // Map not inialized
          if (!map){
            init(DEFAULT_LOCATION, DEFAULT_ZOOM);
          }

          // Map initialised  
          else{   
            map.setZoom(200);      
            map.panTo(centerLocation);
            //map.setMaxBounds(bounds);
            map.setZoom(zoomLevel);      
            map.setView(centerLocation);       
          }
        }
        /*
        $.ajax({
          type: "POST",
          url: domain+'/app/',
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(sampleRequest1),//locationName.replace(/\s/g, '%20')}),
      
            success:  function(json){              
              console.log("---");
              console.log(json);
              //console.log(json);
              //displayData([dataX1,dataX2],availableLayers);              
              var availableLayers = displayData(json["features"]);
              L.control.layers(null, availableLayers).addTo(map);
            }
        });
        */
        if (geoJSON){
          var availableLayers = displayData(geoJSON["features"]);
          L.control.layers(null, availableLayers).addTo(map);
        }
        disable_preloader();

      }

   });

};



 
//create a heatlayer using the leaflet plugin.
//create a FeaturesLayer from sample data
//add each feature to the heat layer.
function testHeat(){
 	heat = L.heatLayer([], { maxZoom: 12 }).addTo(map);
	var layer = L.mapbox.featureLayer(data);
     // Zoom the map to the bounds of the markers.
    // map.fitBounds(layer.getBounds());
    // Add each marker point to the heatmap.
    layer.eachLayer(function(l) {
        heat.addLatLng(l.getLatLng());

});
}

function attachButtonListeners(){
	$("#go").on('click', function(){
	    enable_preloader();
	    zoomTo($("#location").val(),10);
	});

	$("#location").keypress(function(event){
		if ( event.which == 13 ) {
			$('#go').click();
		}
	});

	$("#reset").on('click', function(){
		zoomTo(DEFAULT_LOCATION, DEFAULT_ZOOM);
	});
}
