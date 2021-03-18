import { getOptions, getYear } from './requests.js';
import { initMap } from './map.js';
import { initDropdowns, populateDropdowns } from './dropdowns.js';
import { initSearch, initSort } from './list.js';
import { graph } from './graph.js';
import { candidateGraph } from './candSect.js';

// Leave this blank, value injected during build (see contributing guidelines)
const MAPBOX_KEY = '';

// Element functionality initalised here
function initPage() {
  initMap(MAPBOX_KEY);
  initDropdowns();
  initSort();
  initSearch();
  candidateGraph();
  graph();
}

document.addEventListener('DOMContentLoaded', initPage);

// Dropdown options are populated quickly before request send for year information
// Request handles page population upon completion
function populateOptions(data) {
  populateDropdowns(data.years, data.sources);
  getYear(data.years[0]);
}

// Immediately send a request off for the initial data needed to populate the page
getOptions().then((data) => {
  // Populate dropdowns once the DOM is ready (or immediately if already)
  if (document.readyState !== 'loading') {
    populateOptions(data);
  } else {
    document.addEventListener('DOMContentLoaded', () => populateOptions(data));
  }
});
