import { getYear } from './requests.js';

// Populates a dropdown (identified by ID in HTML) with array of values
async function populateDropdown(id, data) {
  // First clear any existing options
  const dd = document.getElementById(id);
  dd.innerHTML = '';

  // Populate the dropdown with provided options
  data.forEach(val => {
    const opt = document.createElement("option");
    opt.innerHTML = val;
    opt.setAttribute("value", val);
    dd.appendChild(opt);
  });
}

export async function populateDropdowns(years, sources) {
  populateDropdown('dropdown-year', years);
  populateDropdown('dropdown-data', sources);
}


// Adds event handling to drop down elements
export async function initDropdowns() {
  // Handle updates on year change (request method handled page population)
  document.getElementById("dropdown-year").addEventListener("change", e => getYear(e.target.value));

  // Handle updates on source change
  document.getElementById("dropdown-data").addEventListener("change", e => { console.log(e.target.value) })
}