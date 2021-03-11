import {name, dropdown, getSelectedOption} from './dropdown.js';
import {graph} from './graph.js';

window.addEventListener('load', (event) => {
  dropdown("dropdown-year");
  dropdown("dropdown-data");
  graph();
});

