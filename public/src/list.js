function search() {
  const input = document.getElementById("search");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("candid");
  const tr = table.getElementsByTagName("tr");

  for (const i in tr) {
    const td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      const txtValue = td.textContent || td.innerText;
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
export async function populateList(data) {
  // Clear existing rows first
  const [clist] = document.getElementById('candid').getElementsByTagName('tbody');
  clist.innerHTML = '';

  // Document fragment will trigger reflow only once when attached
  const newRows = document.createDocumentFragment();
  data.candidates.forEach(cand => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    const votes = document.createElement("td");

    name.innerHTML = cand.name;
    votes.innerHTML = cand.votes;

    row.appendChild(name);
    row.appendChild(votes);
    newRows.appendChild(row);
  });

  // Populate the table with the new data
  clist.appendChild(newRows);
}

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  //sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
    const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

    return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
  });

  //remove all existing trs from table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  //readd newly sorted rows
  tBody.append(...sortedRows);

  //remember how column is currently sorted
  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);

}

// Enables the sorting functionality of the table headings
export async function initSort() {
  document.querySelectorAll(".candid th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  });
}