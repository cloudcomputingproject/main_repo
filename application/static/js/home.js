 

/* Your custom JavaScript here */

 var southWest = L.latLng(49.5, -12.5),
     northEast = L.latLng(58.774, 4.7125),
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