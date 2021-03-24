import { getData } from "./data";

function search() {
  const input = document.getElementById("search");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("candList");
  const tr = table.getElementsByTagName("tr");

  for (const i in tr) {
    const td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      const txtValue = td.innerHTML;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// No need for this to be synchronous
export async function initSearch() {
  document.getElementById("search").addEventListener("keyup", search);
}

// Clears and populates the list with the data passed in
export async function populateList() {
  // Clear existing rows first
  const [clist] = document.getElementById('candList').getElementsByTagName('tbody');
  clist.innerHTML = '';

  // Document fragment will trigger reflow only once when attached
  const newRows = document.createDocumentFragment();
  getData().candidates.forEach((cand, i) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    const votes = document.createElement("td");

    name.innerHTML = cand.name;
    votes.innerHTML = cand.votes;

    // Can style the rows by their party ID
    row.classList.add(cand.party_ec_id);

    // Store data index in HTML for easy element updates
    row.setAttribute('data-index', i);

    row.addEventListener('click', e => {
      // Style the row as selected (and unstyle previous)
      const prev = document.querySelector('tr.selected');
      if (prev) prev.classList.remove('selected');
      e.currentTarget.classList.add('selected');
    });

    row.appendChild(name);
    row.appendChild(votes);
    newRows.appendChild(row);
  });

  // Populate the table with the new data
  clist.appendChild(newRows);
}

// Hides candidates from other constituencies on map click
export async function updateList(gss_code) {
  // Need candidates in the constituency by their index in the overall data structure
  const indexes = [];
  getData().candidates.forEach((cand, i) => {
    if (cand.gss_code === gss_code) {
      // DOM attributes are strings
      indexes.push(i.toString());
    }
  });

  const [clist] = document.getElementById('candList').getElementsByTagName('tbody');
  const rows = clist.getElementsByTagName('tr');

  // Simply hide all the rows for candidates not in this constituency
  rows.forEach(row => {
    row.style.display = indexes.includes(row.getAttribute('data-index')) ? '' : 'none';
  });
}

export async function populateLegend() {
  const [llist] = document.getElementById('legend').getElementsByTagName('tbody');
  llist.innerHTML = '';

  // Legend only needed for parties with colours
  const significant = getData().parties.filter(p => p.colour);

  // Update the stylesheet to colour party classed elements
  const css = document.getElementById('party-styling');
  css.innerHTML = significant.map(p => `tbody .${p.party_ec_id} { background-color: ${p.colour} !important; }`).join("\n");

  // Sort by name for legend display
  significant.sort((a, b) => a.party_name.localeCompare(b.party_name));

  // Remaining grouped as "Other"
  significant.push({ party_name: 'Other', party_ec_id: 'other' });

  // Document fragment will trigger reflow only once when attached
  const newRows = document.createDocumentFragment();
  significant.forEach(party => {
    const row = document.createElement("tr");
    const name = document.createElement("td");

    name.innerHTML = party.party_name;

    // Can style the rows by their party ID
    row.classList.add(party.party_ec_id);

    row.appendChild(name);
    newRows.appendChild(row);
  });

  // Populate the table with the new data
  llist.appendChild(newRows);
}

function sortTableByColumn(table, column, asc = true, numeric = false) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort rows in place
  rows.sort((a, b) => {
    const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
    const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

    const compA = numeric ? parseInt(aColText) : aColText;
    const compB = numeric ? parseInt(bColText) : bColText;

    return compA > compB ? (1 * dirModifier) : (-1 * dirModifier);
  });

  //remove all existing trs from table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add newly sorted rows
  tBody.append(...rows);

  // Remember how column is currently sorted
  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

// Enables the sorting functionality of the table headings
export async function initSort() {
  const list = document.getElementById('candList');

  list.querySelectorAll('th').forEach((headerCell, i) => {
    headerCell.addEventListener('click', () => {
      const columnIndex = i;
      const isNumeric = i === 1; // Votes column is second
      const isAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(list, columnIndex, !isAscending, isNumeric);
    });
  });
}