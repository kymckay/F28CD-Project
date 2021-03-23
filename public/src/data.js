// Data will be stored here to prevent repeated requests
export const cache = {};

// Year context tracked for element updates
export let curYear;

// Source context tracked for element updates (map toggle and graph)
export let curSource = 0; // Always starts as first

export function setYear(year) {
  curYear = year;
}

export function setSource(index) {
  curSource = index;
}

// Convenience function to get current year's data
export function getData() {
  return cache[curYear];
}