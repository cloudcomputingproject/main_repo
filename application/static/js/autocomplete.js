// $('#location').devbridgeAutocomplete({
//     serviceUrl: function (request, response) {
// 		 jQuery.getJSON(
// 			"http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
// 			function (data) {
// 			 response(data);
// 			}
// 		 )},
//     onSelect: function (suggestion) {
//         alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
//     }
// });
 
jQuery(function () 
 {
	 jQuery("#location").autocomplete({
		source: function (request, response) {
		 jQuery.getJSON(
			"http://gd.geobytes.com/AutoCompleteCity?callback=?&filter=UK&q="+request.term,
			function (data) {
			 response(data);
			 
			}
		 );
		},
		minLength: 2,
		select: function (event, ui) {
		 var selectedObj = ui.item;
		 console.log(JSON.stringify(selectedObj));
		 jQuery("#location").val(selectedObj.value);
		 return false;
		},
		open: function () {
		jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close: function () {
		jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	 });
	 jQuery("#location").autocomplete("option", "delay", 10);
	});

function getcitydetails(fqcn) {
 
	if (typeof fqcn == "undefined") fqcn = jQuery("#f_elem_city").val();
 
	cityfqcn = fqcn;
 
	if (cityfqcn) {
 
	 jQuery.getJSON(
			"http://gd.geobytes.com/GetCityDetails?callback=?&fqcn="+cityfqcn,
		 function (data) {
		 jQuery("#geobytesinternet").val(data.geobytesinternet);
		 jQuery("#geobytescountry").val(data.geobytescountry);
		 jQuery("#geobytesregionlocationcode").val(data.geobytesregionlocationcode);
		 jQuery("#geobytesregion").val(data.geobytesregion);
		 jQuery("#geobyteslocationcode").val(data.geobyteslocationcode);
		 jQuery("#geobytescity").val(data.geobytescity);
		 jQuery("#geobytescityid").val(data.geobytescityid);
		 jQuery("#geobytesfqcn").val(data.geobytesfqcn);
		 jQuery("#geobyteslatitude").val(data.geobyteslatitude);
		 jQuery("#geobyteslongitude").val(data.geobyteslongitude);
		 jQuery("#geobytescapital").val(data.geobytescapital);
		 jQuery("#geobytestimezone").val(data.geobytestimezone);
		 jQuery("#geobytesnationalitysingular").val(data.geobytesnationalitysingular);
		 jQuery("#geobytespopulation").val(data.geobytespopulation);
		 jQuery("#geobytesnationalityplural").val(data.geobytesnationalityplural);
		 jQuery("#geobytesmapreference").val(data.geobytesmapreference);
		 jQuery("#geobytescurrency").val(data.geobytescurrency);
		 jQuery("#geobytescurrencycode").val(data.geobytescurrencycode);
		 }
	 );
	}
}