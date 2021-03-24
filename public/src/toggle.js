export async function initToggle() {
    
    document.getElementById('check-box').addEventListener('change', function() {
        if (!this.checked) {
            document.getElementById('predictionLabel').innerHTML = "Predicted";
        } else {
            document.getElementById('predictionLabel').innerHTML = "Actual"
        };
    })

}