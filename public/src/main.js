import {newDropdown} from './dropdown.js';
import {graph} from './graph.js';
import { candidateGraph } from './candSect.js';
import { enableSearch } from './search.js';

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

  enableSearch();
  candidateGraph();
  graph();
});