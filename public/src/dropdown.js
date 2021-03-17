
export function newDropdown(divId, options) {
  // Div element containing the dropdown is identified by ID
  const dropDiv = document.getElementById(divId);
  const select = document.createElement("select");

  // Populate the dropdown with provided options
  for (const k in options) {
    const opt = document.createElement("option");
    opt.innerHTML = options[k];
    opt.setAttribute("value", k);
    select.appendChild(opt);
  }

  dropDiv.appendChild(select);

  return select;
}