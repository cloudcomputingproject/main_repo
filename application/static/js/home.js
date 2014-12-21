 // global variables
var DEFAULT_LOCATION = "United Kingdom";
var DEFAULT_ZOOM = 5;

var map;
var availableLayers = new Object();
var MAX_CACHE_AGE = 600; //600sec = 10minutes
var cache = new Object();

var domain = document.location.origin;

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
	        	L.mapbox.accessToken = 'pk.eyJ1IjoiY2hpcHNhbiIsImEiOiJqa0JwV1pnIn0.mvduWzyRdcHxK_QIOpetFg';
				map = L.mapbox.map('map').setView(centerLocation, zoomLevel);

	        	var mapLink1 = "tile.openstreetmap.org";
	        	var mapLink2 = "tiles.mapbox.com/v3/{id}"
	        	var tiles = L.tileLayer('http://{s}.'+mapLink1+'/{z}/{x}/{y}.png', {
	                                maxZoom: 18,
	                                id : 'examples.map-20v6611k'
	       		}).addTo(map);

	        	// the Control Panle showing the different layers
	        	//(the method is implemented in controls.js)
	        	addControlPanel(); 
	        	initLayers();  
	      	}
	    });
	}
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
    displayData([data, data2], availableLayers);
    //set the value of the checkboxes based on what data is initially visualised
    //so basically set the default checkboxes
    setCheckboxes([data,data2]);
}

//sets the checkboxes of the Control panel 
//@arr is the default feature collections being showed
function setCheckboxes(arr){
    //get the categories of data used
    var cats = [];
    for (var i = 0; i < arr.length; i++) {
        cats[i] = arr[i]['properties']['type'];
    };
    //set the checkbox value
    for (var i = 0; i < cats.length; i++) {
    	//match the id's from the html of the Control panel
        var name = "#" + cats[i] + "_checkbox"; 
        console.log($(name));

        $(name).prop("checked", true);
    };
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
      url: domain+'/app/geo',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({"name": encodeURIComponent(locationName)}),//locationName.replace(/\s/g, '%20')}),
      
      success:  function(json){
    
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
        // displayData([data,data2],availableLayers);
        disable_preloader();

    }
   });

};
$(document).ready(function(){

  init(DEFAULT_LOCATION, DEFAULT_ZOOM);

  $("#go").on('click', function(){
    //alert("Clicked");
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

});
