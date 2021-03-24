import { updatePredictions } from './graph.js';
import { updateMap } from './map.js';
import { newYear } from './requests.js';
import { setSource } from './data.js';

// Populates a dropdown (identified by ID in HTML) with array of values
async function populateDropdown(id, options, index = false) {
  // First clear any existing options
  const dd = document.getElementById(id);
  dd.innerHTML = '';

  // Populate the dropdown with provided options
  options.forEach((val, i) => {
    const opt = document.createElement("option");
    opt.innerHTML = val;
    opt.setAttribute("value", index ? i : val);
    dd.appendChild(opt);
  });
}

export async function populateDropdowns(years, sources) {
  populateDropdown('dropdown-year', years);
  // Sources are indexed to match to the data array structure
  populateDropdown('dropdown-data', sources, true);
}


// Adds event handling to drop down elements
export async function initDropdowns() {
  // Handle updates on year change (request method handled page population)
  document.getElementById("dropdown-year").addEventListener("change", e => newYear(e.target.value));

  // Handle updates on source change
  document.getElementById("dropdown-data").addEventListener("change", e => {
    setSource(e.target.value); // Source should be respected by other events
    updatePredictions(); // Graph predictions will change
    updateMap(); // Colours may change if toggle active
  });
}