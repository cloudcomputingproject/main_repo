# TerraCognita - Visualise OpenData on a map

## OpenData & Maps

There are tons of open data out there. What we do is providing a pleasent interface to visualise this data.

## How we do it
We provide the user with an interface through which the uesr can specify what sort of data is of interest to him. Also, we allow the user to customise the data he requires - so he can view data which is useful to him.
The information which the user requires is then fetched from the open data sources, processed by us, and sent back to the user.
In our implementation, the data sent back to the user is visualised on a map.

## Basic features
  * Select multiple types of data at the same time
  * Specify the name of the city for which data is needed
  * Draw on the map the area for which data is needed
  * Visualise data as Markers or as Heatmap(or both)
  * Direct access to our API
  
##The map

We are using MapBox to visualise the map and to show the data on it. 

## Behind the scenes 
Python and Flask are the guys powering our back end

## Our API
Our services can be used programatically as well. When using our API you will receive a single geoJSON object containing all the data. 
### Sample request to our API
You need to make a post request (with ajax for example) to our server with data of the format
```javascript
var request_data = {
	name: "police",
    args: {
    	location: {
        	type: "place",
            name: "London"
        },
        category: "theft"
    }
}
```
### Sample response from our API
```javascript
Response
    {
    	"api" : "house",
    	"data" : {
				    "features": [
				        {
				            "geometry": {
				                "coordinates": [
				                    -1.3485599756240845,
				                    50.907440185546875
				                ],
				                "type": "Point"
				            },
				            "id": null,
				            "properties": {
				                "bathNumber": 1,
				                "bedroomNumber": 2,
				                "currency": "GBP",
				                "lastUpdated": 286.5,
				                "price": 229950
				            },
				            "type": "Feature"
				        }
				    ],
				    "type": "FeatureCollection"
				}
    }
```



