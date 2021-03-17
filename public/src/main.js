import { getYears, getYear } from './requests.js';
import { initMap } from './map.js';
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
  initMap(MAPBOX_KEY);
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
