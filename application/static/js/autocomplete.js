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
