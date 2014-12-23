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
             success: function(data) {
                console.log(data);
                $("#control_panel").html( data ); //set the content of control_panel to this html
                // $("#police_checkbox").prop('checked', true); //by default police is checked
                //append the categories of crimes under Police.
                addPoliceCategories();

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
            //we want sync. request, so the html is loaded before we call setCheckboxes()
            async: false
        }); 
}

var PanelControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function (map) {
        //c is the main container for the control panel
        var c = L.DomUtil.create('div', 'navigation-control');
        c.setAttribute('id', 'control_container');
        L.DomEvent.disableClickPropagation(c); //if click/drag/zoom on the panel, the map won't react
        var container = L.DomUtil.create('div', 'navv', c);
        container.setAttribute('id', 'control_panel');
        return c;
    }
}); 

function addCheckBoxListeners(){
    $('#police_checkbox').click(function(event){var $this = $(this); checkBoxHandler(event, $this);});
    $('#restaurant_checkbox').click(function(event){var $this = $(this);checkBoxHandler(event, $this)});
 }

function checkBoxHandler(event, $this) {
    var name = stripName($this.attr('id'));
    console.log(name);
    var layer = availableLayers[name];
    if(!layer){
        console.log('no layer with this name');
        return; 
    }

    if($this.is(':checked')){
         //check if we have the data AND it is not expired
        if(checkIfDataHasExpired(name)){
            //make a request which will update the availableLayers
            //TO-DO
            console.log('expired')
        }
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
        var str = '<input type="checkbox" id="'+el+'"/>'+ el+ '<br/>';
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
function checkIfDataHasExpired(name){
    //check if the data was set x minutes ago or less
    var lastSet = cache[name]; //when the cache was last updated.
    console.log('cache:' + lastSet);
    if(lastSet < 0)  { //true if cache was never set
        return true;
    }
    var now = Math.round(new Date().getTime() / 1000); // SECONDS since 1970
    var ageOfData = now - lastSet;
    //if the data is older than the maximum time we allow the data to be cached for
    if(ageOfData <= MAX_CACHE_AGE){
        return false;
    } else{
        return true;
    }

}

//when collapsing elements, this handles rotating the arrow
 function collapseListener(event,idOfElement) {
    event.preventDefault();
    //rotate the arrow next to the police categories based on whether we collapse it or not
    //check if it is collapsed
    var name = "#"+idOfElement;
    console.log(name);
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

//Sets the checkboxes of the Control panel based on the
//types of the Features passed as @feature_col. the names of the types
//should match the names in the html
//@feature_col is the default feature collections being showed
function setCheckboxes(feature_col){
    //get the categories of data used
    var cats = [];
    for (var i = 0; i < feature_col.length; i++) {
        cats[i] = feature_col[i]['properties']['type'];
    };
    //set the checkbox value
    for (var i = 0; i < cats.length; i++) {
        //match the id's from the html of the Control panel
        var name = "#" + cats[i] + "_checkbox"; 
 
        $(name).prop("checked", true);
    };
}