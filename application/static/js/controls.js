function addControlPanel(){
    // Initialise the Panel control - this would
    // create the DOM elements.
    map.addControl(new PanelControl());
    // After the DOM elements are created, we add listeners to them
    // and append another elements.
	$.ajax({
		 url: 'app/control_panel',
		 success: function(response) {
			$("#control_panel").html( response ); //set the content of control_panel to this html
		 
			addDataHandlerListeners();
			addCollapseListeners();

			setDefaultData();
			
		},
	}); 
}

function addDataHandlerListeners(){
    addUpdateButtonListeners();
    addCheckBoxListeners();
    addTabsListener();
    addDropdownListeners();
}
// Listener for the Update button.
function addUpdateButtonListeners(){
    helperAddDataHandlerListeners('update_map_btn');
}

// Handles when a checkbox of an API category is clicked.
function addCheckBoxListeners(){
    helperAddDataHandlerListeners('main_api_category');
 }
 // For each element with class (@klass because class is JS reserved keyword)
 // get the element api, and assign the appropriate data handler to it.
function helperAddDataHandlerListeners(klass) {
    $("." + klass).each(function(index) {
        var api  = $(this).attr('api');
        var handler = DataHandlerMapper[api];
        if(!handler || !handler.handle){
            console.log(api);
            console.log('cannot find handler');
            return;
        }
        $(this).click(function(event){checkBoxHandler(event, api, handler.handle);});
    });
}

// Handles when a checkbox of an API category is clicked.
// Each layer this handler is addin/removing to the map
// is the layer for the API category. Theses layers are 
// added to availableLayers on page load by initLayers();   
// update is the handle() function comming from the 
// appropriate instance of DataHandler.
function checkBoxHandler(event, api, update){
    enable_preloader();
    var layers = getLayers();
    if(!(api in layers)){
        console.log('no layer with this name');
        disable_preloader();
        return; 
    }

    if($('#'+api+'_checkbox').is(':checked')) {
         // Update will invoke the data handler module.
        update();


    }else {
         //delete the data in the MapBox layers.
        removeDataFromAllLayers(api);
        //remove the listener
        removeAllLabels(api);
        disable_preloader();
    }
}
// When switching between the Search by city name tab and the Draw area tab.
function addTabsListener(){
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var action = $(e.target).attr('action') ;
		if(action === 'draw'){
			var api = $(e.target).attr('api');
			var allowedShapes = $('#draw_api_tab_'+api).attr('allowed_shapes');
			console.log(allowedShapes);
			if(allowedShapes){
				allowedShapes = allowedShapes.split(' ');
				enableDrawing(allowedShapes);    
			} else{
				console.log('no allowedShapes defined');
			}
		} else {
			disableDrawing();
		}
	});
}

function addCollapseListeners(){
     $(".api_accordion").each(function(index){
        $(this).click(function(event){
            var idOfCollapsable = $(this).attr('aria-controls');
            collapseListener(event, idOfCollapsable);
        });
    });
}

function addDropdownListeners(){
    $(".dropdown li").click(function(index){
        var parent_text_id = "#" + $(this).attr('parent_text_id');
        $(parent_text_id).attr('v', $(this).attr('v'));
        $(parent_text_id).html($(this).text());
        console.log($(this).text());
    });
 }

// When collapsing elements, this handles rotating the arrow.
// name - name of the layer.
function collapseListener(event,idOfElement) {
    event.preventDefault();
    // Rotate the arrow next to the police categories based on whether we collapse
	// it or not.
    // Check if it is collapsed.
    var name = "#"+idOfElement;
    if($(name).hasClass('in')){ //contains 'in' - not collapsed
        $('#span_arrow_' + idOfElement).removeClass('glyphicon-chevron-down');
        $('#span_arrow_' + idOfElement).addClass('glyphicon-chevron-right');
    } else{
        $('#span_arrow_' + idOfElement).removeClass('glyphicon-chevron-right');
        $('#span_arrow_' + idOfElement).addClass('glyphicon-chevron-down');
    }
    return true;
}

function setDefaultData(){
	enable_preloader();
	setDefaultCheckboxes();
	// Load and show the default data. 
	PoliceHandler.handle();
}
 
// The default data to be displayed on page load is police all crimes.
function setDefaultCheckboxes(){
    $("#police_checkbox").prop('checked', true);
}

function isTabActive(id){
    id = "#"+id;
    console.log(id);
    if($(id).length === 0){
        console.log("tab doesnt exist");
        return false;
    }
    return ($(id).hasClass('active'));
}

/*Helper functions */

//find the Search city tab for the given API 
//and check if it is visible
function isSearchCityTabActive(api){

    var id_of_tab = 'search_api_tab_heading_'+api;
    
    return isTabActive(id_of_tab);
}

function isDrawAreaTabActive(api){
    var id_of_tab = 'draw_api_tab_heading_'+api;
    
    return isTabActive(id_of_tab);
}

function isMixedSearchActive(api){
    var id_of_tab = 'mixed_api_tab_heading_'+api;
    return isTabActive(id_of_tab);
}

function isAllUkTabActive(api){
     var id_of_tab = 'entire_uk_api_tab_'+api;
    return isTabActive(id_of_tab);
}

function getSearchCityText(api){
    var id_of_input = '#search_city_'+api;
    if($(id_of_input).length === 0){
        return '';
    }
    return $(id_of_input).val();
}

function getDropdownValue(api, dropdown_name){
    var id = "#dropdown_value_container_" +api+"_"+dropdown_name;
    if($(id).length===0){
        return undefined;
    }
    return $(id).attr('v');
    
}

function addLabel(api, md5){
    var id = "#city_name_container_"  + api;
    var label_name = getNameForLabelFromRequest(api);
    var colors = ["label-red", "label-blue", "label-orange", "label-grey", "label-green"];
 
    var color = colors[Math.floor(Math.random()*colors.length)]; //pick a random style
    var new_label_id = '#span_container_' +api+'_'+md5;
    if($(new_label_id).length !== 0) return; //already have label for this md5
    //append a label next to a main api category to label what data is currently visualised
    //for that api and provide the user with easy way to hide the data for a specific city
 
    $(id).append('<span id="span_container_'+api+'_'+md5+'" class="badge badge-default '+color+'"> \
        '+label_name+' | \
        <a class="label_delete" a_parent="span_container_'+api+'_'+md5+'" \
        href="#" id="'+api+'_'+md5+'" md5="'+md5+'"  api="'+api+'"> \
        <strong>✖</strong> \
        </a> \
        </span>');
    //add listener for the label.
    $("#"  + api+"_"+md5).click(function(){
        var api = $(this).attr('api');
        var md5 = $(this).attr('md5');
        var parent_id ="#"+ $(this).attr('a_parent');
        console.log(parent_id);
        deleteLabelListener(api, md5, parent_id);
    });
}

// ID should be a jQuery element.
function removeLabel(id){
    if(id && id.remove){
        id.remove();
        console.log(id);
    } else {
        console.log('id is not $');
    }
        
}
 
function removeAllLabels(api){
    var id = '#city_name_container_'+api;
    $(id).empty();

}
 
function deleteLabelListener(api, md5, parent_id){
    removeDataFromLayer(api, 'markers', md5);
    removeDataFromLayer(api, 'heatmap', md5);
    console.log(parent_id);
    removeLabel($(parent_id));
    if(isDrawAreaTabActive(api)){
        deleteDrawnArea();
    }
}

function getNameForLabelFromRequest(api){
    //check if name was used
    if(isSearchCityTabActive(api)){
        return getSearchCityText(api);
    } else if (isDrawAreaTabActive(api)){
 
        return 'Drawn'
 
    } else if(isMixedSearchActive(api)){
        return getMixedSearchText(api);
    } else {
        console.log('unrecognised tab');
        return ':))';
    }
}

// Returns an object containing the coordinates of the centre of 
// the map and the current zoom.
function getDrawCoordinates(){
    var result = getDrawnAreaBounds();
    return result;
}

function getMixedSearchText(api){
    var id = '#mixed_city_'+api;
    if($(id).length === 0) {
        console.log('cannot find mixed search');
        return '';
    }
    return $(id).val();
}

// Array of Render modes the user has selected for the given API.
// The defaults are currently HeatMap and Markers.
function getRenderMode(api){
    var result = [];
    $(".render_mode_"+api).each(function(el){
        if($(this).is(':checked')){
            result.push($(this).attr('mode'));
        }
    });
    console.log(result);
    return result;
}

function setMainApiCategoryCheckbox(api,bool){
    var id = "#"+ api +"_checkbox";
    $(id).prop(checked, bool);
}

function getApiDate(api){
    console.log(api);
    var id = "#date_selector_"+api;
    console.log( $(id).val());
    if ($(id).length === 0) return undefined;
    return $(id).val();

}

 

function showError(content){
    $('#error_content').text(content);
    $("#alert_container").show();
    $("#alert_close_button").click(function(){
        $("#alert_container").hide();
    });
}
//consturct the Control panel main DOM elements
 
var PanelControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function (map) {
        //c is the main container for the control panel
        var c = L.DomUtil.create('div', 'navigation-control');
        c.setAttribute('id', 'control_container');
        L.DomEvent.disableClickPropagation(c); //if click/drag on the panel, the map won't react

        var container = L.DomUtil.create('div', 'navv', c);
        container.setAttribute('id', 'control_panel');
        return c;
    }
}); 