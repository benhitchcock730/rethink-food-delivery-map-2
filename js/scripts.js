mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // dark basemap
    center: [-73.91076292607373, 40.718914534163154,], // starting position [lng, lat]
    zoom: 10.3, // starting zoom,
}

// instantiate the map
const map = new mapboxgl.Map(mapOptions);

// add a navigation control
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
//

// loop over the siteData array to make a marker for each record
siteData.forEach(function (siteRecord) {

    var color

    // use if statements to assign colors based on siteData.program
    if (siteRecord.program === 'Asylum Seeker Shelter') {
        color = '#8dd6a1'
    }
    if (siteRecord.program === 'Rethink Food HQ') {
        color = '#d67ea6'
    }
    if (siteRecord.program === 'Restaurant Partner') {
        color = '#0077b6'
    }

    var scale

    // use if statements to assign colors based on siteData.program
    if (siteRecord.program === 'Asylum Seeker Shelter') {
        scale = 0.6
    }
    
    if (siteRecord.program === 'Restaurant Partner') {
        scale =0.9
    }

    function getPopupText(siteRecord) {
        let popupText = "";
        switch (siteRecord.program) {
            case "Asylum Seeker Shelter":
                popupText = `${siteRecord.name} is housing ${siteRecord.number} asylum seekers.`;
                break;
            case "Restaurant Partner":
                popupText = `${siteRecord.name} has provided ${siteRecord.number} meals so far. It can deliver meals to any shelters in the blue area in 30 minutes or less.`;
                break;
            // case "Rethink Food HQ":
            //     popupText = `${siteRecord.name} is where the nonprofit staff is located.`;
            //     break;
            default:
                popupText = "Program information not available.";
                break;
        }
        return popupText;
    }

    const popup = new mapboxgl.Popup({
        offset: 24,
        anchor: 'bottom'
    }
    ).setText(
        getPopupText(siteRecord)
    );

    // create a marker, set the coordinates, add the popup, add it to the map
    new mapboxgl.Marker({
        scale: scale,
        color: color
    })
        .setLngLat([siteRecord.longitude, siteRecord.latitude])
        .setPopup(popup)
        .addTo(map);

})


// Create points under the pins for the isochrone layer 
var points = [
    {
      "type": "Feature",
      "properties": {
        "name": "Beatstro"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-73.92707039162654, 40.80753274886378,]
      }
    },
    {
        "type": "Feature",
        "properties": {
          "name": "Brain Food"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-73.99118972046641, 40.69080464712702,]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Rethink HQ"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-74.01115533109368, 40.70500051637887,]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Marlow Bistro"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [ -73.96366285050132, 40.80320969545546,]
        }
      },
  ];


  // Add points to the map
  map.on('load', function () {
    map.addSource('points', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': points
      }
    });
  
    map.addLayer({
      'id': 'dots',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-radius': 20,
        'circle-color': 'transparent'
      }
    });
  

// Add click event listener to each point
map.on('click', 'dots', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;

    if (map.getLayer('isochrone')) {
        map.removeLayer('isochrone');
        map.removeSource('isochrone');
    }


      // Calculate isochrone for 30 mins of driving
      $.ajax({
        method: 'GET',
        url: 'https://api.mapbox.com/isochrone/v1/mapbox/driving/' + coordinates.join(',') + '?contours_minutes=30&polygons=true&access_token=' + mapboxgl.accessToken,
        dataType: 'json',
        success: function (data) {
          var isochrone = data.features[0].geometry.coordinates;
          // Draw isochrone on the map
          map.addLayer({
            'id': 'isochrone',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': isochrone
                }
              }
            },
            'layout': {},
            'paint': {
              'fill-color': '#0080ff',
              'fill-opacity': 0.5
            }
          });
          isochroneVisible = true;
        }
      });
    
    });
  
    // Change the cursor to a pointer when the mouse is over the points layer.
    map.on('mouseenter', 'markers', function () {
      map.getCanvas().style.cursor = 'pointer';
    });
  
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'markers', function () {
      map.getCanvas().style.cursor = '';
    });
     
    
  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['dots']
    });

    if (!features.length) {
        if (map.getLayer('isochrone')) {
            map.removeLayer('isochrone');
            map.removeSource('isochrone');
        }
    }
});
    
  });


