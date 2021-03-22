import { populateCandidate } from './candidate.js';
import { cache, curYear, setYear } from './data.js';
import { populateGraph } from './graph.js';
import { populateLegend, populateList } from './list.js';

export function getOptions() {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        // Successful request
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(this.status);
        }
      }
    };

    xhttp.open('POST', '/options', true);
    xhttp.send();
  })
}

function getYear(year) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        // Successful request
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(this.status);
        }
      }
    };

    xhttp.open('POST', '/year', true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.send(JSON.stringify({ year }));
  });
}

// TODO: make spinners for the unpopulated elements while waiting
export async function newYear(year) {
  setYear(year);

  // Use data cache to prevent repeated requests to the server for the same thing
  if (!(year in cache)) {
    cache[year] = await getYear(year);
  }

  // Asynchronous code means a new year could be requested before the data resolves
  // No need to update elements if the desired year now differs
  if (curYear === year) {
    populateLegend();
    populateList();
    populateGraph();
    populateCandidate();
  }
}