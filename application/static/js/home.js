 // global variables
var DEFAULT_LOCATION = "England";
var DEFAULT_ZOOM = 6;

var map;

$(document).ready(function(){
  
  $("#go").on('click', function(){
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

var domain = document.location.origin;

var init = function(locationName, zoomLevel){

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

        var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
                                id: 'qwerty123123.k312hg0n'
                                }).addTo(map);
        }

    });

  }

}(DEFAULT_LOCATION, DEFAULT_ZOOM);

var zoomTo = function(locationName, zoomLevel) {



	$.ajax({
      type: "POST",
      url: domain+'/app/geo',
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({"name": locationName}),
      
      success:  function(json){
    
        var centerLocation = L.latLng(json["results"][0]["geometry"]["location"]["lat"],
                         json["results"][0]["geometry"]["location"]["lng"]);

        // Bounds
        var northEast = L.latLng(json["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
                       json["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
        var southWest = L.latLng(json["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
                         json["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);

        bounds = L.latLngBounds(southWest, northEast);

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

   });

};
