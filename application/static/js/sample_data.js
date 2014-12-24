var data = { "type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.388799,53]},
        "properties": {"type": "police", "value": "1"}
        },
     { "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": [[0.388799,53], [0.481811, 52.371837], [0.388799,52.35]]},
        "properties": {"type": "police", "value": "2"}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.481811, 52.371837]},
        "properties": {"type": "police", "value": "10"}
        }
         
       ],
       "properties" : {"type":"police"}
     };

var data2 = { "type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.388799,52.35]},
        "properties": {"type": "restaurant", "value": "4"}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.487521,52.333833]},
        "properties": {"type": "restaurant", "value": "3"}
        },
     { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [0.481811, 52.371837]},
        "properties": {"type": "restaurant", "value": "7"}
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
