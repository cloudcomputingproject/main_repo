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