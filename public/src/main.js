/* global L */ // Defined by Leaflet

import { newDropdown } from './dropdown.js';
import { graph } from './graph.js';
import { candidateGraph } from './candSect.js';
import { enableSearch } from './search.js';
import { enableSort } from './sort.js';

// Leave this blank, value injected during build (see contributing guidelines)
const MAPBOX_KEY = '';

window.addEventListener('load', () => {
  // Hardcoded data temporarily
  const yearSel = newDropdown("dropdown-year", ["2019", "2017", "2015", "2010"]);
  const srcSel = newDropdown("dropdown-data", ["Electoral Calculus", "Financial Times", "Bloomberg", "Politico", "BBC"]);

  // Handle updates on year change
  yearSel.addEventListener("change", e => {
    console.log(e.value);
  })

  // Handle updates on source change
  srcSel.addEventListener("change", e => {
    console.log(e.value);
  })

  enableSort();
  enableSearch();
  candidateGraph();
  graph();

  // If key wasn't set (or failed to inject) don't initalise the map section
  if (!MAPBOX_KEY) {
    document.getElementById("map").innerHTML = "Map appears here. API key not configured (see contributing guidelines).";
    return;
  }

  // Map initalisation

  const coor = [-3.1883, 55.9533]
  mapboxgl.accessToken = MAPBOX_KEY;
  const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
    center: coor, // Starting position [lng, lat]
    zoom: 12, // Starting zoom level
  });

  const marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat(coor, 5) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

  const geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: MAPBOX_KEY, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    placeholder: 'Search for places in United Kingdom',// Placeholder text for the search bar
    bbox: [-8.196671, 50.064075, 1.737475, 60.917070], // Boundary for Berkeley
    marker: false, // Do not use the default marker style
  });
  
  // Add the geocoder to the map
  map.addControl(geocoder);

});