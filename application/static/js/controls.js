/*var NavControl =  L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        // create the control container with a particular class name
        //(tag,class-name,container) returns HTML element
        var container = L.DomUtil.create('div', 'navigation-control');
        var textBox = L.DomUtil.create('input','textBox',container);
        textBox.setAttribute("id","location");
        textBox.setAttribute("value","London");
        //make the go Btn
        var goBtn = L.DomUtil.create('button','button',container);
        goBtn.setAttribute('type','button');
        goBtn.setAttribute('value','click');
        goBtn.setAttribute('id','goo');
        goBtn.innerHTML = "Go";
        var resetBtn = L.DomUtil.create('button','button',container);
        resetBtn.setAttribute('type','button');
        resetBtn.setAttribute('value','click');
        resetBtn.setAttribute('id','reset');
        resetBtn.innerHTML = "Reset Map";
        // ... initialize other DOM elements, add listeners, etc.
        console.log($("#goo"));
 $("#goo").on('click', function(){
    alert("Clicked");
    zoomTo($("#location").val(),10);
  });
        return container;
    }
});
*/
function addControlPanel(){
    //initialise the Panel control - this would
    //create the DOM elements.
    map.addControl(new PanelControl());
    //after the DOM elements are created, we add listeners to them,
    //and append another elements
        $.ajax({
             url: 'static/includes/control_panel.html',
             success: function(response) {
                 $("#control_panel").html( response ); //set the content of control_panel to this html
                //add the API's we support to the Control panel
                addPolice();
                addRestaurants();
                addWeather();

                addUpdateButtonListeners();

                setDefaultData();
                
                //these listeners will show/hide map layers
                //they depend that the id attributes of the corresponding html elements(checkboxes) are
                //set with accordance to the names of the data categories we support
                //so in the html of the control panel, the id of the checkbox for the police layer
                //will be  police_checkbox
                //the 'police' bit is also the name of the layer for this data. it is also
                //equal to the data type that the server supports.
                addCheckBoxListeners();

                 //set the default data category  to be visualised
            },
        }); 
}

//add all fields associated with the Police API
function addPolice(){
    addPoliceCategories();

 }
 //add all fields associated with the Restaurants API

function addRestaurants(){
    //TO DO add the restaurants fields

}
//add all fields associated with the Weather API
function addWeather(){
    //TO DO add the weather fields

}

//listener for the Update button
function addUpdateButtonListeners(){
    $(".update_map_btn").each(function(index){
        var api  = $(this).attr('api');
        var handler = DataHandlerMapper[api];
        if(!handler || !handler.handle){
            console.log('cannot find handler');
            return;
        }
        $(this).on('click', function(){handler.handle();});
    });
}

//handles when a checkbox of an API category is clicked.
function addCheckBoxListeners(){
    $(".main_api_category").each(function(index){
        var api_category = $(this).attr('api');
        var handler = DataHandlerMapper[api_category];
        if(!handler || !handler.handle){
            console.log('cannot find handler for the specified API cateogry');
            return;
        }
        $(this).click(function(event){var $this = $(this); checkBoxHandler(event, $this, handler.handle);});
        // $('#restaurant_checkbox').click(function(event){var $this = $(this);checkBoxHandler(event, $this, RestaurantHandler.handle)});
        // $('#weather_checkbox').click(function(event){var $this = $(this);checkBoxHandler(event, $this, WeatherHandler.handle)});
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
function addPoliceCategories(){
    var server_json = $('#map').data('fromserver');

    var categories = server_json.policeCategories;  
    categories.forEach(function(el){
        var str = '<input type="checkbox" class="police_category" id="'+el+'"/>'+ el+ '<br/>';
        $('#police_categories_checkboxes').append(str);
    });
    $("#police_categories").click(function(event){collapseListener(event, 'collapsePoliceCategories')});

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
  // var police_layer = availableLayers['police'];
  // var heat = L.heatLayer([ [0.388799,53, '10'], [0.487521,52.333833, '5'], [0.481811, 52.371837,'15']], {radius: 25}).addTo(map);
  // police_layer.eachLayer(function(l){
  //   console.log(l);
  //   heat.add
  // });

 }
//the default data to be displayed on page load is police all crimes
function setDefaultCheckboxes(){
    $('.police_category').each(function(index){
        if(index === 0){
            $(this).prop('checked', true);
        }
    });
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