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
export function populateList(data) {
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
