import { populateList, populateLegend } from './list.js';
import { populateGraph } from './graph.js';
import { populateCandidate } from './candidate.js';

// Data will be stored here to prevent repeated requests
const cache = {};

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
  // No need to repeat requests
  if (year in cache) return cache[year];

  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        // Successful request
        if (this.status === 200) {
          cache[year] = JSON.parse(this.responseText);
          resolve(cache[year]);
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
  const data = await getYear(year);

  populateLegend(data.parties);
  populateList(data.candidates);
  populateGraph(data.parties);
  populateCandidate(data);
}