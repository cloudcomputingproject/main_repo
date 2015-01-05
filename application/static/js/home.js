 /*
 Entry point of the front end
 The model and the view are initialised here
 The map is initialised here
The control panel(the side panel on the right) is initialised here.
 */
 // global variables
var DEFAULT_LOCATION_NAME = "United Kingdom";
var DEFAULT_centerLocation = L.latLng(55.378051,-3.435973);
var DEFAULT_northEast = L.latLng(60.8606697,33.916555);
var DEFAULT_southWest = L.latLng(34.5625145,-8.649357199999999);
var DEFAULT_ZOOM = 6;

var map_init_options  = {
    centerLocation: DEFAULT_centerLocation, 
    zoomLevel: DEFAULT_ZOOM,
    mapbox_access_token: 'pk.eyJ1IjoiY2hpcHNhbiIsImEiOiJqa0JwV1pnIn0.mvduWzyRdcHxK_QIOpetFg'        
};
var map;

var domain = document.location.origin;

//entry point for the front end logic
$(document).ready(function() {
	init();
	attachButtonListeners();
});


//get the coordinates for the initial location
//and then using them, set up the map,
//add it's ControlPanel,
//initialise the layers on the map,
//	and add default content to them(this is done by initLayer)
function init(){
  if(!map){
    setMap(map_init_options);
  } 
    initModel();
    initView();
    addControlPanel(); 

}
function zoomTo(centerLoation, zoomLevel){
  if (map){
    map.setZoom(200);      
    map.panTo(centerLoation);            
    map.setZoom(zoomLevel);      
    map.setView(centerLoation);    
  }
}

function setMap(map_init_options){

	L.mapbox.accessToken = map_init_options.mapbox_access_token;
	map = L.mapbox.map('map',  null, { zoomControl:false }).setView(map_init_options.centerLocation, map_init_options.zoomLevel);

	var mapLink1 = "tile.openstreetmap.org";
	var mapLink2 = "tiles.mapbox.com/v3/{id}";
	var tiles = L.tileLayer('http://{s}.'+mapLink1+'/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        id : 'examples.map-20v6611k'
		}).addTo(map);
  L.control.zoom({position:'bottomleft'}).addTo(map);
 
  return map;
}

//this function gets the data which is passed from the controller trhrouh the
//template engine.
//the data is attached to an html element attribute( the #map <div> in our case)
function getServerData(){
  var data = $('#map').data("fromserver");
  // console.log(x);
  return data;
}
 
function getAPINames(){
  var server_data = getServerData();
  return server_data.categoriesAPI;
}

function attachButtonListeners(){
  $("#toggle_nav").on('click', function(){
    $('#main_nav').toggle({duration: 600});
 
  });
	$("#go").on('click', function(){
	    enable_preloader();
      var handler = DataHandlerMapper["geoCoding"];
      handler.handle();
      disable_preloader();
	    
	});

	$("#location").keypress(function(event){
		if ( event.which == 13 ) {
			$('#go').click();
		}
	});

	$("#reset").on('click', function(){
		zoomTo(DEFAULT_centerLocation, DEFAULT_ZOOM);

	});
}
