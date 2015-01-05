//code to handle drawing on the map
var drawControl;
var featureGroup;
var area;
var rawLayer;
function enableDrawing(allowedShapes){
	
	//hide if existing and then show it again
	if(drawControl){
		disableDrawing();
	}
 	var draw = {
 		polygon: 0,
	    polyline: 0,
	    rectangle: 0,
	    circle: 0,
	    marker: 0
	};
	allowedShapes.forEach(function(el){
	 	if (draw[el] === 0){
	 		draw[el] = true;
	 	}
	});

 featureGroup = L.featureGroup().addTo(map);

 	 drawControl = new L.Control.Draw({
	  edit: {
	    featureGroup: featureGroup
	  },
	  draw: draw
	}).addTo(map);
 	
 	 //there is extra styling on the Draw control in main.css
	map.on('draw:created', showPolygonArea);
	map.on('draw:edited', showPolygonAreaEdited);
 
}
function disableDrawing(){
	if(drawControl !== undefined ){
		drawControl.removeFrom(map);
		featureGroup.clearLayers();
		area = undefined;
	}
	drawControl = undefined;
}
function deleteDrawnArea(){
			featureGroup.clearLayers();

}
//returns geoJSON with the coordinates of the shape
function getDrawnAreaBounds(){
	return area;
}
//return the object
function getRawLayer(){
	return rawLayer;
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
  rawLayer = e.layer;
  console.log(e.layer.getLatLngs());
  console.log(area);
  e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
  e.layer.openPopup();
}