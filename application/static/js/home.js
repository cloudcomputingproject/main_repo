 

/* Your custom JavaScript here */



// Zooms the map in to the <locationName>
// (takes location (e.g Southampton)  and Zoom Level (e.g 8).)
(function(locationName,zoomLevel) {
 	//zoomLevel = 8;
	//var locationName = "Cambrige";
	var geoCodingAPI_URL = "http://localhost:8080/api/2/";
	
	$.getJSON( geoCodingAPI_URL+locationName).success(function( json ) {

      	var northEast = L.latLng(json["results"][0]["geometry"]["bounds"]["northeast"]["lat"],
      							   json["results"][0]["geometry"]["bounds"]["northeast"]["lng"]);
      	var southWest = L.latLng(json["results"][0]["geometry"]["bounds"]["southwest"]["lat"],
      						       json["results"][0]["geometry"]["bounds"]["southwest"]["lng"]);
      	bounds = L.latLngBounds(southWest, northEast);

      	var map = L.map('map',{
 	 		center: [52, -1.5],
 			zoom: zoomLevel,
 			maxBounds: bounds
 		});

 		var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', 
	 	{
        	id: 'qwerty123123.k312hg0n'
     	}).addTo(map);

    });
})();

/*
 var southWest = L.latLng(49.8669688, -8.649357199999999),
     northEast = L.latLng(60.856553, 1.7627096),
     bounds = L.latLngBounds(southWest, northEast);

 var map = L.map('map',{
 	center: [52, -1.5],
 	zoom: 6,
 	maxBounds: bounds
 });
//.setView([52,-1.5], 6);
 var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', 
     {
         id: 'qwerty123123.k312hg0n'
     }).addTo(map);

 //L.marker([57.5, 1.7]).addTo(map);

 */



