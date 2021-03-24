import { updateMap } from "./map";

export let state;

export async function initToggle() {
  document.getElementById('check-box').addEventListener('change', function() {
    state = this.checked;

    document.getElementById('predictionLabel').innerHTML = this.checked ? "Colour Map: Predicted" : "Colour Map: Actual";

    updateMap();
  });
}