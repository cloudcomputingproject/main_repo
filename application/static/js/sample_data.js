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


var sampleFinalRequest_1 = {
 
    "geoCoding":{
        "name": "London"
    }
 
}
 
var sampleFinalRequest_2 = {
 
    "geoJSON":{
        "features": [
            {
                "name": "police",
                "args": {
                    "category": "all-crimes",
                    "location": {                        
                        "name": "CityName",
                        "area": [[1,1]],
                        "all": true
                    }
                }
            }
        ]
    }
}


var geoResponce_1 = { "geoCoding": {
   "results" : [
      {
         "address_components" : [
            {
               "long_name" : "Cambridge",
               "short_name" : "Cambridge",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Cambridge",
               "short_name" : "Cambridge",
               "types" : [ "postal_town" ]
            },
            {
               "long_name" : "Cambridgeshire",
               "short_name" : "Cambs",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "England",
               "short_name" : "England",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United Kingdom",
               "short_name" : "GB",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Cambridge, Cambridge, UK",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 52.237855,
                  "lng" : 0.1919273
               },
               "southwest" : {
                  "lat" : 52.1598292,
                  "lng" : 0.048047
               }
            },
            "location" : {
               "lat" : 52.205337,
               "lng" : 0.121817
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 52.237855,
                  "lng" : 0.1919273
               },
               "southwest" : {
                  "lat" : 52.1598292,
                  "lng" : 0.048047
               }
            }
         },
         "types" : [ "locality", "political" ]
      },
      {
         "address_components" : [
            {
               "long_name" : "Cambridge",
               "short_name" : "Cambridge",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Gloucester",
               "short_name" : "Gloucester",
               "types" : [ "postal_town" ]
            },
            {
               "long_name" : "Gloucestershire",
               "short_name" : "Glos",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "England",
               "short_name" : "England",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United Kingdom",
               "short_name" : "GB",
               "types" : [ "country", "political" ]
            },
            {
               "long_name" : "GL2",
               "short_name" : "GL2",
               "types" : [ "postal_code_prefix", "postal_code" ]
            }
         ],
         "formatted_address" : "Cambridge, Gloucester, Gloucestershire GL2, UK",
         "geometry" : {
            "location" : {
               "lat" : 51.73193,
               "lng" : -2.3649
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 51.73327898029149,
                  "lng" : -2.363551019708498
               },
               "southwest" : {
                  "lat" : 51.7305810197085,
                  "lng" : -2.366248980291502
               }
            }
         },
         "types" : [ "locality", "political" ]
      }
   ],
   "status" : "OK"
}
}

