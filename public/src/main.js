import { getOptions } from './requests.js';
import { initMap } from './map.js';
import { initDropdowns, populateDropdowns } from './dropdowns.js';
import { initSearch, initSort, populateList } from './list.js';
import { graph } from './graph.js';
import { candidateGraph } from './candSect.js';

// Leave this blank, value injected during build (see contributing guidelines)
const MAPBOX_KEY = '';

// Element functionality initalised here
function initPage() {
  initMap(MAPBOX_KEY);
  initDropdowns(populatePage);
  initSort();
  initSearch();
  candidateGraph();
  graph();
}

// Populates all derivative elements whenever a new year's data is retrieved
function populatePage(data) {
  populateList(data);
}

function populateOptions(data) {
  populateDropdowns(data.years, data.sources);
}

document.addEventListener('DOMContentLoaded', initPage);

// Immediately send a request off for the initial data needed to populate the page
getOptions().then((data) => {
  // Populate dropdowns once the DOM is ready (or immediately if already)
  if (document.readyState !== 'loading') {
    populateOptions(data);
  } else {
    document.addEventListener('DOMContentLoaded', () => populateOptions(data));
  }
});
