 // global variables
var DEFAULT_LOCATION = "England";
var DEFAULT_ZOOM = 6;

var map;
var availableLayers = new Object();


var domain = document.location.origin;

var init = function (locationName, zoomLevel){

  if (!map){


 
		$.ajax({
      type: "POST",
      url: domain+'/app/geo',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({"name": locationName}),

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

        map = L.map('map',{
           center: centerLocation,
           zoom: zoomLevel,
           //maxBounds: bounds
        });
        var mapLink1 = "tile.openstreetmap.org";
        var mapLink2 = "tiles.mapbox.com/v3/{id}"
        var tiles = L.tileLayer('http://{s}.'+mapLink1+'/{z}/{x}/{y}.png', {
                                maxZoom: 18,
                                // id: 'qwerty123123.k312hg0n'
                                id : 'examples.map-20v6611k'
                                }).addTo(map);

        //after the request has been made draw controls
        map.addControl(new NavControl());

        //create layers
        //dictionary to store layer (name,reference) //map to store feature type : layers, which will later be used to filter information
  
        var layerData = ["police","restaurants"];
        for (var i = 0; i < layerData.length; i++) {
          availableLayers[layerData[i]] = L.geoJson(false, {
          style: function (feature) {
                return feature.properties && feature.properties.style;
                },
              onEachFeature: onEachFeature,
              pointToLayer: drawFeature
            }
              ).addTo(map);
            };
            //add to map
          L.control.layers(null, availableLayers).addTo(map);    


        }


    });

  }
  

};
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
        displayData([data,data2],availableLayers);
        

    }

   });

};
$(document).ready(function(){

  init(DEFAULT_LOCATION, DEFAULT_ZOOM);


  $("#go").on('click', function(){
    alert("Clicked");
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