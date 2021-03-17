export async function getYears() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    // Successful request
    if (this.readyState === 4 && this.status === 200) {
      const res = JSON.parse(this.responseText);
      console.log(res);
    }
  };

  xhttp.open('POST', '/years', true);
  xhttp.send();
}

export function getYear(year) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    // Successful request
    if (this.readyState === 4 && this.status === 200) {
      const res = JSON.parse(this.responseText);
      console.log(res);
    }
  };

  xhttp.open('POST', '/year', true);
  xhttp.setRequestHeader("Content-Type", "application/json");

  xhttp.send(JSON.stringify({ year }));
}