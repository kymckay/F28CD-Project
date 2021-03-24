/* global mapboxgl, MapboxGeocoder */ // Defined by Mapbox GL JS

import { getData } from "./data";
import { updateList } from './list.js';

let mapbox;

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

  mapbox = new mapboxgl.Map({
    container: 'map', // ID in the HTML
    style: 'mapbox://styles/mapbox/light-v10',
    center: ukCentre,
    zoom: 4.9,
    maxBounds: ukBounds
  });

  const geocoder = new MapboxGeocoder({
    accessToken: apiKey,
    mapboxgl: mapboxgl,
    placeholder: 'Search for places in United Kingdom',
    bbox: ukSearchBounds,
    proximity: {
      longitude: long,
      latitude: lat
    },
    marker: false
  });

  // Add the geocoder to the map
  mapbox.addControl(geocoder);

  const popup = new mapboxgl.Popup({
    closeButton: false
  });

  // After the map style has loaded on the page,
  // add a source layer and default styling for a single point
  mapbox.on('load', function () {

    // polygon GeoJson
    mapbox.addSource('constituency', {
      type: 'geojson',
      data: 'https://opendata.arcgis.com/datasets/937997590f724a398ccc0100dbd9feee_0.geojson'
      // data: '..public/assets/constituencies.geojson'
    });

    // add polygon fill
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
    updateColours();

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

    mapbox.on('mouseleave', 'constituency-fill', function () {
      mapbox.getCanvas().style.cursor = '';
      popup.remove();
      mapbox.setFilter('constituency-highlighted', ['in', 'pcon19nm', '']);
    });

    // Add source fo search pin
    mapbox.addSource('single-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // add the search pin
    mapbox.addLayer({
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
      mapbox.getSource('single-point').setData(e.result.geometry);
    });

    mapbox.on('click', 'constituency-highlighted', function (e) {
      const constArea = e.features[0].properties.st_areashape;
      if (constArea > 500000000) {
        mapbox.flyTo({center: [e.features[0].properties.long, e.features[0].properties.lat], zoom: 7});
      } else {
        mapbox.flyTo({center: [e.features[0].properties.long, e.features[0].properties.lat], zoom: 10});
      }
      const gss_id = e.features[0].properties.pcon19cd;
      updateList(gss_id);
    });
  });
}

function updateColours() {
  // Do nothing if the layers don't exist yet
  if (!mapbox.getLayer('constituency-fill')) return;

  const data = getData();

  const colourMap = {};

  // Find winner of constituency and map it to their party colour
  data.constituencies.forEach(c => {
    // Find party colour of candidate with most votes in the constituency
    const cands = data.candidates.filter(ca => ca.gss_code === c.gss_code);
    cands.sort((a, b) => b.votes - a.votes);
    const colour = data.parties.find(p => p.party_ec_id === cands[0].party_ec_id).colour;

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
  updateColours();
}