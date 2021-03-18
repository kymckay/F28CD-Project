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

export function getYear(year) {
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
  })
}