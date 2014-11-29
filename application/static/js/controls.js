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
        goBtn.setAttribute('id','go');
        goBtn.innerHTML = "Go";
        var resetBtn = L.DomUtil.create('button','button',container);
        resetBtn.setAttribute('type','button');
        resetBtn.setAttribute('value','click');
        resetBtn.setAttribute('id','reset');
        resetBtn.innerHTML = "Reset Map";
        // ... initialize other DOM elements, add listeners, etc.

        return container;
    }
});

*/
var PanelControl = L.Control.extend({
    options: {
    
        position: 'topright'
    },
    onAdd: function (map) {
        var c = L.DomUtil.create('div', 'navigation-control');
        c.setAttribute('id', 'control_container');
        var container = L.DomUtil.create('div', 'navv', c);
        container.setAttribute('id', 'control_panel');
        $.get( "static/includes/control_panel.html", function( data ) {
            $( "#control_panel" ).html( data ); //set the content of control_panel to this html
            var server_json = $('#map').data('fromserver');

             var categories = server_json.policeCategories;  
            categories.forEach(function(el){
                var str = '<input type="checkbox" id="'+el+'"/>'+ el+ '<br/>';
                $('#police_categories_checkboxes').append(str);
            });
            $("#police_categories").click(function(event){
                event.preventDefault();
            
                //rotate the arrow next to the police categories based on wheter we collapse it or not
                //check if it is collapsed
                var classes = $('#collapsePoliceCategories').attr('class').split(' ');
                if(classes.indexOf('in') !== -1){ //contains 'in' - not collapsed
                    
                    $('#span_arrow').removeClass('glyphicon-chevron-down');
                    $('#span_arrow').addClass('glyphicon-chevron-right');
                } else{
                    $('#span_arrow').removeClass('glyphicon-chevron-right');
                    $('#span_arrow').addClass('glyphicon-chevron-down');
                }
                return true;

            });
        });
      
        
       return c;
    }
});



