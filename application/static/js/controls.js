function addControlPanel(){
    //initialise the Panel control - this would
    //create the DOM elements.
    map.addControl(new PanelControl());
    //after the DOM elements are created, we add listeners to them,
    //and append another elements
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
//listener for the Update button
function addUpdateButtonListeners(){
    helperAddDataHandlerListeners('update_map_btn');
}

//handles when a checkbox of an API category is clicked.
function addCheckBoxListeners(){
    helperAddDataHandlerListeners('main_api_category');
 }
 //for each element with class (@klass because class is JS reserved keyword)
 //get the element api, and assign the appropriate data handler to it.
function helperAddDataHandlerListeners(klass){
       $("." + klass).each(function(index){
        var api  = $(this).attr('api');
        var handler = DataHandlerMapper[api];
        if(!handler || !handler.handle){
            console.log(api);
            console.log('cannot find handler');
            return;
        }
        $(this).click(function(event){ checkBoxHandler(event, api, handler.handle);});
    });
}

//handles when a checkbox of an API category is clicked.
//each layer this handler is addin/removing to the map
//is the layer for the API category. Theses layers are 
//added to availableLayers on page load by initLayers();   
//update is the handle() function comming from the 
//appropriate instance of DataHandler 
function checkBoxHandler(event, api, update) {
    enable_preloader();

    var name = api;
    console.log(api);
    var layers = getLayers();
    var layer = layers[api];
    if(!(api in layers)){
        console.log('no layer with this name');
        disable_preloader();
        return; 

    }

    if($('#'+api+'_checkbox').is(':checked')){
         //update will invoke the data handler module
        update();

    }else {
         //delete the data in the MapBox layers.
        removeDataFromLayer(api, 'heatmap' );
        removeDataFromLayer(api, 'markers' );
        disable_preloader();
    }
}
//when switiching between the Search by city name tab and the Draw area tab
function addTabsListener(){
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var action = $(e.target).attr('action') ;
    if(action === 'draw'){
        var api = $(e.target).attr('api');
        var allowedShapes = $('#draw_api_tab_'+api).attr('allowed_shapes');
        console.log(allowedShapes)
        if(allowedShapes){

            allowedShapes = allowedShapes.split(' ');
            enableDrawing(allowedShapes);    
        } else{
            console.log('no allowedShapes defined');
        }
    } else{
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
        var api = $(this).attr('api');

        var parent_text_id = "#" + $(this).attr('parent_text_id');
        $(parent_text_id).attr('v', $(this).attr('v'));
        $(parent_text_id).html($(this).text());
        console.log($(this).text())
    });
 }
 //police_checkbox   ----> police
function stripName(nameWithHashtag){
    if(nameWithHashtag.indexOf('_') === -1){
        console.log('the id of a checkbox is not set properly');
        return '';
    }
    var temp1 = nameWithHashtag.split("_"); //temp1 = ['#police', "_checkbox"]
    return temp1[0];
 }
 //name - name of the layer


//when collapsing elements, this handles rotating the arrow
 function collapseListener(event,idOfElement) {
    event.preventDefault();
    //rotate the arrow next to the police categories based on whether we collapse it or not
    //check if it is collapsed
    var name = "#"+idOfElement;
    if($(name).hasClass('in')){ //contains 'in' - not collapsed
        $('#span_arrow_' + idOfElement).removeClass('glyphicon-chevron-down');
        $('#span_arrow_' + idOfElement).addClass('glyphicon-chevron-right');
    } else{
        $('#span_arrow_' + idOfElement).removeClass('glyphicon-chevron-right');
        $('#span_arrow_' + idOfElement).addClass('glyphicon-chevron-down');
    }
    return true;

};

function setDefaultData(){
  setDefaultCheckboxes();
  PoliceHandler.handle(); //this will load and show the default data
 }
//the default data to be displayed on page load is police all crimes
function setDefaultCheckboxes(){
    $("#police_checkbox").prop('checked', true);
}

function isTabActive(id){
    id = "#"+id;
    console.log(id)
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
    var selector = $(id);
    if($(id).length===0){
        return undefined;
    }
    return $(id).attr('v');
    
}
//returns an object containt the coordinates of the centre of the map
//and the current zoom
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
//array of which Render modes the user has selected for the given api
//The defaults are currently HeatMap and Markers
function getRenderMode(api){
    var result = [];
    $(".render_mode_"+api).each(function(el){
        if($(this).is(':checked')){
            result.push($(this).attr('mode'));
        }
    })
    console.log(result)
    return result;
}
function setMainApiCategoryCheckbox(api,bool){
    var id = "#"+ api +"_checkbox";
    $(id).prop(checked, bool);
}

function getApiDate(api){
    console.log(api)
    var id = "#date_selector_"+api;
    console.log( $(id).val());
    if ($(id).length === 0) return undefined;
    return $(id).val();

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