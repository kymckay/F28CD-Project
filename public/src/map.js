/* global mapboxgl, MapboxGeocoder */ // Defined by Mapbox GL JS

export async function initMap(apiKey) {
  // If key wasn't set (or failed to inject) don't initalise the map section
  if (!apiKey) {
    document.getElementById("map").innerHTML = "Map appears here. API key not configured (see contributing guidelines).";
    return;
  }

  const long = -2.821868;
  const lat = 55.612226;
  const ukCentre = [long, lat];
  const ukSearchBounds = [-8.196671, 50.064075, 1.737475, 60.917070];
  const ukBounds = [[-12.696671, 49.064075],[6.237475, 60.917070]];
  mapboxgl.accessToken = apiKey;

  const map = new mapboxgl.Map({
    container: 'map', // ID in the HTML
    style: 'mapbox://styles/mapbox/light-v10',
    center: ukCentre,
    zoom: 4.9,
    maxBounds: ukBounds
  });

  // const areaGeocoder = new MapboxGeocoder({
  //   accessToken: apiKey,
  //   mapboxgl: mapboxgl,
  //   zoom: 18,
  //   placeholder: 'Search UK Places',
  //   bbox: ukSearchBounds,
  //   proximity: {
  //     longitude: long,
  //     latitude: lat
  //   },
  //   marker: false
  // });
  
  const constituencyGeocoder = new MapboxGeocoder({
    accessToken: apiKey,
    localGeocoder: dummy,
    externalGeocoder: localSearch,
    mapboxgl: mapboxgl,
    zoom: 8,
    placeholder: 'Search Constituency',
    bbox: ukSearchBounds,
    proximity: {
      longitude: long,
      latitude: lat
    },
    marker: false
  });

  // Add the geocoder to the map
  // map.addControl(areaGeocoder);
  map.addControl(constituencyGeocoder);

  function dummy() {
    console.log('dummy');
    return [];
  }
  
  function localSearch(query) {
    const matchingFeatures = [];
    return fetch('https://opendata.arcgis.com/datasets/937997590f724a398ccc0100dbd9feee_0.geojson')
      .then(res => res.json())
      .then((data) => {
          console.log(data);
          data.features.forEach(feature => {
              if (
                feature.properties.pcon19nm
                  .toLowerCase()
                  .search(query.toLowerCase()) !== -1
              ) {
                feature.properties.geometry = [feature.properties.long, feature.properties.lat];
                feature['place_name'] = `📍 ${feature.properties.pcon19nm}`;
                feature['center'] = [feature.properties.long, feature.properties.lat];
                matchingFeatures.push(feature);
              }
          });
          return Promise.resolve(matchingFeatures);
        }
      );
  }

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
    });

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

    map.on('mousemove', 'constituency-fill', function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
       
      // Use the first found feature.
      const feature = e.features[0];
       
      // Query the constituencies layer visible in the map.
      // Use filter to collect only results with the same constituency name.
      // TODO: To be used with Colouring of map - not really used on this branch
      // const relatedFeatures = map.querySourceFeatures('constituency-fill', {
      //   sourceLayer: 'original',
      //   filter: ['in', 'pcon19nm', feature.properties.pcon19nm]
      // });
       
      // Add features with the same constituency name
      // to the highlighted layer.
      map.setFilter('constituency-highlighted', [
        'in',
        'pcon19nm',
        feature.properties.pcon19nm
      ]);
       
      // Display a popup with the name of the constituency.
      popup
      .setLngLat([feature.properties.long, feature.properties.lat])
      .setText(`${feature.properties.pcon19nm} (Reigning Party: )`)
      .addTo(map);
    });
       
    map.on('mouseleave', 'constituency-fill', function () {
      map.getCanvas().style.cursor = '';
      popup.remove();
      map.setFilter('constituency-highlighted', ['in', 'pcon19nm', '']);
    });

    // // Add source fo search pin
    // map.addSource('single-point', {
    //   type: 'geojson',
    //   data: {
    //     type: 'FeatureCollection',
    //     features: []
    //   }
    // });

    // // add the search pin
    // map.addLayer({
    //   id: 'point',
    //   source: 'single-point',
    //   type: 'circle',
    //   paint: {
    //     'circle-radius': 6,
    //     'circle-color': '#448ee4'
    //   }
    // });

    // Add source fo search pin
    map.addSource('single-point-2', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // add the search pin
    map.addLayer({
      id: 'point-2',
      source: 'single-point-2',
      type: 'fill',
      'paint': {
        'fill-outline-color': '#484896',
        'fill-color': '#3c4750',
        'fill-opacity': 0.2
      },
    });

    // Listen for the `result` event from the Geocoder
    // `result` event is triggered when a user makes a selection
    //  Add a marker at the result's coordinates
    // areaGeocoder.on('result', function (e) {
    //   map.getSource('single-point').setData(e.result.geometry);
    // });
    constituencyGeocoder.on('result', function (e) {
      map.getSource('single-point-2').setData(e.result.geometry);
    });
  });
}