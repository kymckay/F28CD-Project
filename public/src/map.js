/* global mapboxgl, MapboxGeocoder */ // Defined by Mapbox GL JS

import { curSource, getData } from "./data";
import { updateList } from './list.js';
import { updateGraph } from "./graph";
import { state as toggleState } from "./toggle";

let mapbox;

export async function initMap(apiKey) {
  // If key wasn't set (or failed to inject) don't initalise the map section
  if (!apiKey) {
    document.getElementById("map").innerHTML = "Map appears here. API key not configured (see contributing guidelines).";
    return;
  }

  // Finding the centre of UK
  const long = -2.821868;
  const lat = 55.612226;
  const ukCentre = [long, lat];
  // ukBounds to be used only for setting the border of the view
  const ukBounds = [[-12.696671, 49.064075],[6.237475, 60.917070]];
  mapboxgl.accessToken = apiKey;

  const jsonData = '/assets/constituencies.geojson';

  // Init. the map
  mapbox = new mapboxgl.Map({
    container: 'map', // ID in the HTML
    style: 'mapbox://styles/mapbox/light-v10',
    center: ukCentre,
    zoom: 4.9,
    maxBounds: ukBounds
  });

  // Search function to supplements geocoded results with constituencies
  // https://docs.mapbox.com/mapbox-gl-js/example/forward-geocode-custom-data/
  function localSearch(query) {
    // Do nothing if the source doesn't exist yet
    if (!mapbox.getSource('constituency')) return;

    // Perform case insensitive search against constituency name property
    const features = mapbox.querySourceFeatures('constituency').filter(f => {
      return (f.properties.pcon19nm.search(new RegExp(query, 'i')) !== -1);
    });

    // Return objects used by the map
    return features.map(f => ({
      ...f,
      'place_name': `📍 ${f.properties.pcon19nm}`,
      center: [f.properties.long, f.properties.lat],
      'place_type': ['constituency']
    }));
  }

  const geocoder = new MapboxGeocoder({
    accessToken: apiKey,
    localGeocoder: localSearch,
    mapboxgl: mapboxgl,
    zoom: 11,
    speed: 100,
    placeholder: 'Search UK Places',
    countries: 'gb',
    proximity: {
      longitude: long,
      latitude: lat
    },
    marker: false
  });

  // Add the geocoder to the map
  mapbox.addControl(geocoder);

  // Define popup to be used on mouse hover
  const popup = new mapboxgl.Popup({
    closeButton: false
  });

  // After the map style has loaded on the page,
  // add a source layer and default styling for a single point
  mapbox.on('load', function () {

    // Add a source
    mapbox.addSource('constituency', {
      type: 'geojson',
      data: jsonData
    });

    // add polygon fill, based on source 'constituency'
    mapbox.addLayer(
      {
        'id': 'constituency-fill',
        'type': 'fill',
        'source': 'constituency',
        'layout': {},
        'paint': {
          'fill-outline-color': '#0d324d',
          'fill-color': '#F1F1F0',
          'fill-opacity': 0.2
        }
      },
      'settlement-label' // Place layer under labels
    );

    // Add filled constituencys for highlighted display
    mapbox.addLayer(
      {
        'id': 'constituency-highlighted',
        'type': 'fill',
        'source': 'constituency',
        'paint': {
          'fill-outline-color': '#484896',
          'fill-color': '#F1F1F0',
          'fill-opacity': 0.75
        },
        // Display none by adding a
        // filter with an empty string.
        'filter': ['in', 'pcon19nm', '']
      },
      'settlement-label' // Place layer under labels
    );

    // Set layer styling after they exist
    updateColours(true);

    mapbox.on('mousemove', 'constituency-fill', function (e) {
      // Change the cursor style as a UI indicator.
      mapbox.getCanvas().style.cursor = 'pointer';

      // Use the first found feature.
      const feature = e.features[0];

      // Add features with the same constituency name
      // to the highlighted layer.
      mapbox.setFilter('constituency-highlighted', [
        'in',
        'pcon19nm',
        feature.properties.pcon19nm
      ]);

      // Display a popup with the name of the constituency.
      popup
        .setLngLat([feature.properties.long, feature.properties.lat])
        .setText(`${feature.properties.pcon19nm}`)
        .addTo(mapbox);
    });

    // define popup closing action on mouse leave
    mapbox.on('mouseleave', 'constituency-fill', function () {
      mapbox.getCanvas().style.cursor = '';
      popup.remove();
      mapbox.setFilter('constituency-highlighted', ['in', 'pcon19nm', '']);
    });

    // Add source for search area
    mapbox.addSource('single-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // add the search area
    mapbox.addLayer({
      id: 'point-2',
      source: 'single-point',
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
    geocoder.on('result', e => {
      mapbox.getSource('single-point').setData(e.result.geometry);
    });

    mapbox.on('click', 'constituency-highlighted', e => {
      const constArea = e.features[0].properties.st_areashape;
      if (constArea > 500000000) {
        mapbox.flyTo({center: [e.features[0].properties.long, e.features[0].properties.lat], zoom: 7});
      } else {
        mapbox.flyTo({center: [e.features[0].properties.long, e.features[0].properties.lat], zoom: 10});
      }
      const gss_id = e.features[0].properties.pcon19cd;
      updateList(gss_id);
      updateGraph(gss_id);
      document.getElementById('graph-title').innerHTML = "Votes per Party: Actual vs Predicted";
    });
  });
}

function updateColours() {
  // Do nothing if the layers don't exist yet
  if (!mapbox.getLayer('constituency-fill')) return;

  // Always respect the toggle state when coulouring map
  const useReal = !toggleState;
  const data = getData();

  const colourMap = {};

  // Find winner of constituency and map it to their party colour
  data.constituencies.forEach(c => {
    // Find party colour of candidate with most votes in the constituency
    // (candidates sorted by votes by default)
    let winner;
    const cands = data.candidates.filter(ca => ca.gss_code === c.gss_code);
    if (useReal) {
      winner = cands[0];
    } else {
      winner = cands.sort((a, b) => b.predictions[curSource] - a.predictions[curSource])[0];
    }

    const colour = data.parties.find(p => p.party_ec_id === winner.party_ec_id).colour;

    // Skip over parties with no colour
    if (!colour) return;

    // Add the constituency to the group for this colour
    if (!(colour in colourMap)) { colourMap[colour] = []; }
    colourMap[colour].push(c.gss_code);
  });

  // Match expression expects alternating cases (can be array of values) and then output
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#match
  const colourings = [];
  for (const k in colourMap) {
    colourings.push(colourMap[k]);
    colourings.push(k);
  }
  colourings.push('#F1F1F0'); // Default case at end is grey

  const dataRules = [
    'match',
    ['get', 'pcon19cd'], // The GSS code
    ...colourings
  ];

  mapbox.setPaintProperty('constituency-fill', 'fill-color', dataRules);
  mapbox.setPaintProperty('constituency-highlighted', 'fill-color', dataRules);
}

export function updateMap() {
  updateColours(true);
}