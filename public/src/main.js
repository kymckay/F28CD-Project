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


});