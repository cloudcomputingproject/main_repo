//map to store feature type : layers, which will later be used to filter information
var layers = new Object();
//accepts array of Feature collections
var displayData = function(data){

	//alert(JSON.stringify(data));
	for (var i = 0; i < data.length; i++) {
		var fc = data[i];
		var fcName = fc.properties.type;
		alert("Name:"+fcName);
		
		var layer =	L.geoJson(fc, {
			style: function (feature) {
	        	return feature.properties && feature.properties.style;
	        	},
	        onEachFeature: onEachFeature,
	        pointToLayer: drawFeature
		    }
	        ).addTo(map);
		layers[fcName] = layer;
	}
	return layers;	
};
	//additional processing of features
	function onEachFeature(feature, layer) {
		//adding pop-up
			// var popupContent = "<p>I started out as a GeoJSON " +
			// 		feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

			// if (feature.properties && feature.properties.popupContent) {
			// 	popupContent += feature.properties.popupContent;
			// }

			// layer.bindPopup(popupContent);
		
		
	}
	//handles feature drawing, called to draw each feature
	function drawFeature(feature, latlng) {
		return L.circleMarker(latlng, {
			radius: 8,
			fillColor: "#ff7800",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.5
		});
	}


		// L.geoJson(data, {

		// 	filter: function (feature, layer) {
		// 		if (feature.properties) {
		// 			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
		// 			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		// 		}
		// 		return false;
		// 	},

		// 	//onEachFeature: onEachFeature
		// }).addTo(map);

		// var coorsLayer = L.geoJson(coorsField, {

		// 	pointToLayer: function (feature, latlng) {
		// 		return L.marker(latlng, {icon: baseballIcon});
		// 	},

		// 	onEachFeature: onEachFeature
		// }).addTo(map);
