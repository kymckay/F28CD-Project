/* global L */ // Defined by Leaflet

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

  // Map initalisation
  const mymap = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    // Note: Mapbox public token goes here. As this is client side code there's no security concern.
    // However, we'd still like to avoid having it in the source code.
    accessToken: MAPBOX_KEY
  }).addTo(mymap);
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
