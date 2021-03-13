import {name, dropdown, getSelectedYear, getSelectedSource} from './dropdown.js';
import {graph,  setSelectedYear} from './graph.js';

window.addEventListener('load', (event) => {
  dropdown("dropdown-year");
  dropdown("dropdown-data");
  let myChart = graph();

  window.addEventListener('click', (event) => {
    setSelectedYear(getSelectedYear(), myChart);
  });
});



