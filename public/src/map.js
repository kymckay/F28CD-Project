/* global mapboxgl, MapboxGeocoder */ // Defined by Mapbox GL JS

export async function initMap(apiKey) {
  // If key wasn't set (or failed to inject) don't initalise the map section
  if (!apiKey) {
    document.getElementById("map").innerHTML = "Map appears here. API key not configured (see contributing guidelines).";
    return;
  }

  const long = -3.1883;
  const lat = 55.9533;
  const coor = [long, lat];
  mapboxgl.accessToken = apiKey;
  const map = new mapboxgl.Map({
    container: 'map', // ID in the HTML
    style: 'mapbox://styles/mapbox/light-v10',
    center: coor,
    zoom: 12,
  });

  const geocoder = new MapboxGeocoder({
    accessToken: apiKey,
    mapboxgl: mapboxgl,
    placeholder: 'Search for places in United Kingdom',
    bbox: [-8.196671, 50.064075, 1.737475, 60.917070],
    proximity: {
      longitude: long,
      latitude: lat
    },
    marker: false
  });

  // Add the geocoder to the map
  map.addControl(geocoder);

  const popup = new mapboxgl.Popup({
    closeButton: false
  });

  // After the map style has loaded on the page,
  // add a source layer and default styling for a single point
  map.on('load', function () {
    
    // polygon GeoJson
    map.addSource('constituency', {
      type: 'geojson',
      data: 'https://opendata.arcgis.com/datasets/937997590f724a398ccc0100dbd9feee_0.geojson'
      // data: '..public/assets/constituencies.geojson'
    })
  
    // add polygon fill
    map.addLayer(
      {
        'id': 'constituency-fill',
        'type': 'fill',
        'source': 'constituency',
        'layout': {},
        'paint': {
          'fill-outline-color': '#0d324d',
          'fill-color': '#7f5a83',
          'fill-opacity': 0.2         
        }
      }, 
       'settlement-label' // place constituency beneath label
    );

    // Add filled constituency constituency
    // for highlighted display.
    map.addLayer(
      {
        'id': 'constituency-highlighted',
        'type': 'fill',
        'source': 'constituency',
        'paint': {
          'fill-outline-color': '#484896',
          'fill-color': '#6e599f',
          'fill-opacity': 0.75
        },
        // Display none by adding a
        // filter with an empty string.
        'filter': ['in', 'pcon19nm', '']
      },
        'settlement-label' // Place constituency under labels.
    ); 

    // Add source fo search pin
    map.addSource('single-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // add the search pin
    map.addLayer({
      id: 'point',
      source: 'single-point',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#448ee4'
      }
    });

    // Listen for the `result` event from the Geocoder
    // `result` event is triggered when a user makes a selection
    //  Add a marker at the result's coordinates
    geocoder.on('result', function (e) {
      map.getSource('single-point').setData(e.result.geometry);
    });
  });
}