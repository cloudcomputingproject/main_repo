var data = { "type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.388799,53]},
        "properties": {"type": "police", 'value':'15'}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.487521,52.333833]},
        "properties": {"type": "police", 'value':'10'}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.481811, 52.371837]},
        "properties": {"type": "police","value":"5"}
        }
         
       ],
       "properties" : {"type":"police"}
     };

var data2 = { "type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [4.488799,52.35]},
        "properties": {"type": "restaurant", 'value':'12'}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [4.587521,52.333833]},
        "properties": {"type": "restaurant", 'value':'14'}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [4.581811, 52.371837]},
        "properties": {"type": "restaurant", 'value':'10'}
        }
         
       ],
       "properties" :{"type":"restaurant"}
     };

var sampleRequest1 = {
    "location": {
        "bounds": {
            "NorthEast": [
                0,
                52
            ],
            "SouthWest": [
                1,
                54
            ]
        },
        "name": "Southampton"
    },
    "features": [
        {
            "name": "police",
            "args": {
                "category": "all-crimes"
            }
        },
        {
            "name": "restaurants",
            "args": {
                "arg_name": "value"
            }
        },
        {
            "name": "weather",
            "args": {
                "arg_name": "value"
            }
        }
    ]
}



var sampleRequest2 = {
    "geoCoding":{
        "name": "London"
    },

    "geoJSON":{
        "location": {
            "bounds": {
                "NorthEast": [
                 0,
                 52
                ],
                "SouthWest": [
                1,
                54
               ]
            },
            "name": "Southampton"
         },

        "features": [
            {
                "name": "police",
                "args": {
                    "category": "all-crimes"
                }
            },
            {
                "name": "restaurants",
                "args": {
                    "arg_name": "value"
                }
            },
            {
                "name": "weather",
                "args": {
                    "arg_name": "value"
                }
            }
        ]
    }
}


var sampleRequest3 = {
    "geoJSON":{
        "location": {
            "bounds": {
                "NorthEast": [
                 0,
                 52
                ],
                "SouthWest": [
                1,
                54
               ]
            },
            "name": "Southampton"
         },

        "features": [
            {
                "name": "police",
                "args": {
                    "category": "all-crimes"
                }
            },
            {
                "name": "restaurants",
                "args": {
                    "arg_name": "value"
                }
            },
            {
                "name": "weather",
                "args": {
                    "arg_name": "value"
                }
            }
        ]
    }
}
