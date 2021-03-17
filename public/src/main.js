import { getYears } from './requests.js';
import { initMap } from './map.js';
import { initDropdowns, populateDropdowns } from './dropdowns.js';
import { graph } from './graph.js';
import { candidateGraph } from './candSect.js';
import { populateList, initSearch } from './list.js';
import { enableSort } from './sort.js';

// Leave this blank, value injected during build (see contributing guidelines)
const MAPBOX_KEY = '';

// Element functionality initalised here
function initPage() {
  initMap(MAPBOX_KEY);
  initDropdowns();
  enableSort();
  initSearch();
  candidateGraph();
  graph();
}

// Populates elements whenever a new year's data is retrieved
function populatePage(data) {
  populateDropdowns(data.years, data.sources);
  populateList(data);
}

document.addEventListener('DOMContentLoaded', initPage);

// Immediately send a request off for the initial data needed to populate the page
getYears().then((data) => {
  // Populate elements once the DOM is ready (or immediately if already)
  if (document.readyState !== 'loading') {
    populatePage(data);
  } else {
    document.addEventListener('DOMContentLoaded', () => populatePage(data));
  }
});
