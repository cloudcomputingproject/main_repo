 /*
Initialise the map and all of its components
The control panel is initialised here.
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
var availableLayers = {};
 

 

var domain = document.location.origin;

//entry point for the front end logic
$(document).ready(function() {
	init();
	attachButtonListeners();
});

function zoomTo(centerLoation, zoomLevel){
  if (map){
    map.setZoom(200);      
    map.panTo(centerLoation);            
    map.setZoom(zoomLevel);      
    map.setView(centerLoation);    
  }
}
//get the coordinates for the initial location
//and then using them, set up the map,
//add it's ControlPanel,
//initialise the layers on the map,
//	and add default content to them(this is done by initLayer)
function init(){
     // Setting to UK values for initialisation      	
	  // bounds = L.latLngBounds(DEFAULT_southWest, DEFAULT_northEast);
		//set up MapBox
	  
    // setMap(map_init_options);
  	// the Control Panel showing the different layers
  	//(the method is defined in controls.js)
  if(!map){
    setMap(map_init_options)
  } 
    initModel();
    initView();
    addControlPanel(); 
    // testHeat() ;

   
}

function setMap(map_init_options){

	L.mapbox.accessToken = map_init_options.mapbox_access_token;
	map = L.mapbox.map('map',  null, { zoomControl:false }).setView(map_init_options.centerLocation, map_init_options.zoomLevel);

	var mapLink1 = "tile.openstreetmap.org";
	var mapLink2 = "tiles.mapbox.com/v3/{id}"
	var tiles = L.tileLayer('http://{s}.'+mapLink1+'/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        id : 'examples.map-20v6611k'
		}).addTo(map);
  L.control.zoom({position:'bottomleft'}).addTo(map);
 
  return map;
}
//add to the map the layers based on the categories available(this comes from the server)
//then add the default content to the map and set the checkboxes on the control panel.
// function initLayers(){
 
//   	var serverData = getServerData(); //this is the data passed as a variable when rendering the template
//   	var layerData = serverData['categoriesAPI']; //all the types of data we support
//     console.log(layerData);
//     //create layers
//     //dictionary to store layer (name,reference) //map to store feature type : layers, which will later be used to filter information
//     for (var i = 0; i < layerData.length; i++) {
//         availableLayers[layerData[i]] = L.geoJson(false, {
//         style: function (feature) {
//               return feature.properties && feature.properties.style;
//               },
//             onEachFeature: onEachFeature,
//             pointToLayer: drawFeature
//         }).addTo(map);
//      }
//     //make a request for the default data to be displayed
//     //TO-DO make a request for the police data
//     //add the data to the layers and show it
 
//     //set the value of the checkboxes based on what data is initially visualised
//     //so basically set the default checkboxes
// }


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
// var zoom = function(locationName, zoomLevel) {
//   var handler = DataHandlerMapper["geoCoding"];
//   handler.handle();
// };

// var zoomTo = function(locationName, zoomLevel) {

// 	$.ajax({
//       type: "POST",
//       url: domain+'/app/allData',
//       dataType: "json",
//       contentType: "application/json",
//       data: JSON.stringify(sampleFinalRequest_1),//locationName.replace(/\s/g, '%20')}),
//       error: function(){

//         console.log("fail >><< ");
//         disable_preloader();

//       },
//       success:  function(json){        
//         bigJson = json;
//         json = bigJson["geoCoding"];
//         geoJSON = bigJson["geoJSON"];

//         if (json){
//           console.log("1:");
//           console.log(json);
//           console.log("2:");
//           console.log(geoJSON);
//           var centerLocation = L.latLng(json["results"][0]["geometry"]["location"]["lat"],
//                            json["results"][0]["geometry"]["location"]["lng"]);

//           // Bounds

//           if (L.latLng(json["results"][0]["geometry"]["bounds"])){
//             var northEast = L.latLng(json["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
//                          json["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
//             var southWest = L.latLng(json["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
//                            json["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);

//             bounds = L.latLngBounds(southWest, northEast);
//           }

//         // Map not inialized
//           if (!map){
//             init(DEFAULT_LOCATION, DEFAULT_ZOOM);
//           }

//           // Map initialised  
//           else{   
//             map.setZoom(200);      
//             map.panTo(centerLocation);
//             //map.setMaxBounds(bounds);
//             map.setZoom(zoomLevel);      
//             map.setView(centerLocation);       
//           }
//         }
//         /*
//         $.ajax({
//           type: "POST",
//           url: domain+'/app/',
//           dataType: "json",
//           contentType: "application/json",
//           data: JSON.stringify(sampleRequest1),//locationName.replace(/\s/g, '%20')}),
      
//             success:  function(json){              
//               console.log("---");
//               console.log(json);
//               //console.log(json);
//               //displayData([dataX1,dataX2],availableLayers);              
//               var availableLayers = displayData(json["features"]);
//               L.control.layers(null, availableLayers).addTo(map);
//             }
//         });
//         */
//         if (geoJSON){
//           var availableLayers = displayData(geoJSON["features"]);
//           L.control.layers(null, availableLayers).addTo(map);
//         }
//         disable_preloader();

//       }

//    });

// };



 
//create a heatlayer using the leaflet plugin.
//create a FeaturesLayer from sample data
//add each feature to the heat layer.
function testHeat(){
  console.log(map)
  console.log(data)
    var heat = L.heatLayer([], { maxZoom: 12 }).addTo(map);
 	var heat2 = L.heatLayer([], { maxZoom: 12 }).addTo(map);
    console.log(heat)
	var layer = L.geoJson(data);
  var heat_data = [];
  layer.eachLayer(function(d){
    console.log(d)
    heat_data.push(d.getLatLng());
    heat.addLatLng(d.getLatLng());
  });
    map.fitBounds(layer.getBounds())
     // Zoom the map to the bounds of the markers.
    // map.fitBounds(layer.getBounds());
    // Add each marker point to the heatmap.
     var resetData = function(){
      heat2.setLatLngs(heat_data);
                console.log('heatmap layer recreated')

    };
     var delete_data = function(){
       heat.setLatLngs([]);
           console.log('heatmap layers cleared');

    };
     setTimeout(delete_data, 5000);
    
    setTimeout(resetData, 8000);

}

function attachButtonListeners(){
  $("#toggle_nav").on('click', function(){
    // $('#main_nav').toggle({easing :'easeOutCubic'});
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
