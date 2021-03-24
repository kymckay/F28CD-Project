import { updateMap } from "./map";

export let state;

export async function initToggle() {
  document.getElementById('check-box').addEventListener('change', function() {
    state = this.checked;

    if (this.checked) {
      document.getElementById('predictionLabel').innerHTML = "Predicted"
    } else {
      document.getElementById('predictionLabel').innerHTML = "Actual"
    }

    updateMap();
  })

}