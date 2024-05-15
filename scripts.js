mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

var mapOptions = {
    container: 'map-container', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // dark basemap
    center: [-73.91076292607373, 40.718914534163154,], // starting position [lng, lat]
    zoom: 10.7, // starting zoom,
}

// instantiate the map
const map = new mapboxgl.Map(mapOptions);

// add a navigation control
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');