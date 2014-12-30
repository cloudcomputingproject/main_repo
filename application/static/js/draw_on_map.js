//code to handle drawing on the map
var drawControl;
var featureGroup;
var area;
 function enableDrawing(){

 featureGroup = L.featureGroup().addTo(map);

 	 drawControl = new L.Control.Draw({
	  edit: {
	    featureGroup: featureGroup
	  },
	  draw: {
	    polygon: true,
	    polyline: false,
	    rectangle: true,
	    circle: true,
	    marker: false
	  }
	}).addTo(map);
 	
 	 //there is extra styling on the Draw control in main.css
	map.on('draw:created', showPolygonArea);
	map.on('draw:edited', showPolygonAreaEdited);
}
function disableDrawing(){
	if(drawControl !== undefined ){
		drawControl.removeFrom(map);
		featureGroup.clearLayers();
		console.log(getAreaBounds())
		area = undefined;
	}
	drawControl = undefined;
}
//returns geoJSON with the coordinates of the polygon
function getDrawnAreaBounds(){
	return area;
}
function showPolygonAreaEdited(e) {
  e.layers.eachLayer(function(layer) {
    showPolygonArea({ layer: layer });
  });
}
function showPolygonArea(e) {
  featureGroup.clearLayers();
  featureGroup.addLayer(e.layer);
  area = e.layer.toGeoJSON();
  e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
  e.layer.openPopup();
}