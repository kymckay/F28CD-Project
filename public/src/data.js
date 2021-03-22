// Data will be stored here to prevent repeated requests
export const cache = {};

// Year context tracked for element update data requests
export let curYear;

export function setYear(year) {
  curYear = year;
}