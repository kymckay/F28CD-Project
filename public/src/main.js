/* global mapboxgl, MapboxGeocoder */ // Defined by Mapbox GL JS

import { getYears, getYear } from './requests.js';
import { newDropdown } from './dropdown.js';
import { graph } from './graph.js';
import { candidateGraph } from './candSect.js';
import { enableSearch } from './search.js';
import { enableSort } from './sort.js';

// Leave this blank, value injected during build (see contributing guidelines)
const MAPBOX_KEY = '';

// Element functionality initalised here
function initPage() {
  enableSort();
  enableSearch();
  candidateGraph();
  graph();

  // If key wasn't set (or failed to inject) don't initalise the map section
  if (!MAPBOX_KEY) {
    document.getElementById("map").innerHTML = "Map appears here. API key not configured (see contributing guidelines).";
    return;
  }

  const long = -3.1883;
  const lat = 55.9533;
  const coor = [long, lat];
  mapboxgl.accessToken = MAPBOX_KEY;
  const map = new mapboxgl.Map({
    container: 'map', // ID in the HTML
    style: 'mapbox://styles/mapbox/light-v10',
    center: coor,
    zoom: 12,
  });

  const geocoder = new MapboxGeocoder({
    accessToken: MAPBOX_KEY,
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

  // After the map style has loaded on the page,
  // add a source layer and default styling for a single point
  map.on('load', function () {
    map.addSource('single-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

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

// Dropdowns need data to initalise with
function initDropdowns(data) {
  // Populate year dropdown and handle updates on year change
  const yearSel = newDropdown("dropdown-year", data.years);
  yearSel.addEventListener("change", e => getYear(e.target.value));


  const srcSel = newDropdown("dropdown-data", data.sources);

  // Handle updates on source change
  srcSel.addEventListener("change", e => { console.log(e.target.value) })
}

// Populates elements whenever a new year's data is retrieved
function populatePage(data) {
  // Clear existing rows first
  const [ clist ] = document.getElementById('candid').getElementsByTagName('tbody');
  clist.innerHTML = '';

  // Document fragment will trigger reflow only once when attached
  const newRows = document.createDocumentFragment();
  data.candidates.forEach(cand => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    const votes = document.createElement("td");

    name.innerHTML = cand.name;
    votes.innerHTML = cand.votes;

    row.appendChild(name);
    row.appendChild(votes);
    newRows.appendChild(row);
  });

  // Populate the table with the new data
  clist.appendChild(newRows);
}

document.addEventListener('DOMContentLoaded', initPage);

// Immediately send a request off for the initial data needed to populate the page
getYears().then((data) => {
  const init = () => {
    initDropdowns(data);
    populatePage(data);
  };

  // Populate elements once the DOM is ready (or immediately if already)
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
});
