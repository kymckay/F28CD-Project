//Reference: https://www.w3schools.com/howto/howto_custom_select.asp

let selectedYear;
let selectedSource;

export function dropdown(className) {
  // Classname
  const x = document.getElementsByClassName(className);

  for (const i in x) {
    const [element] = x[i].getElementsByTagName("select");

    /*for each element, create a new DIV that will act as the selected item:*/
    const a = document.createElement("div");
    a.setAttribute("class", "select-selected");
    a.innerHTML = element.options[element.selectedIndex].innerHTML;
    x[i].appendChild(a);

    /*for each element, create a new DIV that will contain the option list:*/
    const b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");

    // for each option in the original select element, create a new DIV that will act as an option item:
    for (const j in element) {
      const c = document.createElement("DIV");
      c.innerHTML = element.options[j].innerHTML;

      c.addEventListener("click", () => {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        const [s] = this.parentNode.parentNode.getElementsByTagName("select");
        const h = this.parentNode.previousSibling;

        for (const i in s) {
          if (s.options[i].innerHTML === this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            const y = this.parentNode.getElementsByClassName("same-as-selected");
            for (const k in y) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
        //I assume this will be the place from which a request for data update will be sent?
        if (className === "dropdown-year") {
          selectedYear = this.innerHTML;
        } else if (className === "dropdown-data") {
          selectedSource = this.innerHTML;
        }

      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", e => {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    const arrNo = [];
    const x2 = document.getElementsByClassName("select-items");
    const y = document.getElementsByClassName("select-selected");

    for (const i in y) {
      if (elmnt === y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }

    for (const i in x2) {
      if (arrNo.indexOf(i)) {
        x2[i].classList.add("select-hide");
      }
    }
  }

  /*if the user clicks anywhere outside the select box,
  then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);
}

export function getSelectedYear() {
  return selectedYear;
}

export function getSelectedSource() {
  return selectedSource;
}

