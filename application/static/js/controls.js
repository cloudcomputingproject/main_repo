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
        $(this).click(function(event){ checkBoxHandler(event, $(this), handler.handle);});
    });
}

//handles when a checkbox of an API category is clicked.
//each layer this handler is addin/removing to the map
//is the layer for the API category. Theses layers are 
//added to availableLayers on page load by initLayers();   
//update is the handle() function comming from the 
//appropriate instance of DataHandler 
function checkBoxHandler(event, $this, update) {
    var name = stripName($this.attr('id'));

    var layer = availableLayers[name];
    if(!layer){
        console.log('no layer with this name');
        return; 
    }

    if($this.is(':checked')){
        //update will make a request to the server(if necessery), and update the particular layer in
        //availableLayers.
        update();

        layer = availableLayers[name];
        map.addLayer(layer);
    }else {
        map.removeLayer(layer);
    }
}
function addCollapseListeners(){
     $(".api_accordion").each(function(index){
        $(this).click(function(event){
            var idOfCollapsable = $(this).attr('aria-controls');
            collapseListener(event, idOfCollapsable);
        });
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
    var classes = $(name).attr('class').split(' ');
    if(classes.indexOf('in') !== -1){ //contains 'in' - not collapsed
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