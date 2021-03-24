export async function initToggle() {
    
    document.getElementById('checkbox').addEventListener('click', function() {
        let reults;
        const lab = document.getElementById('Prediction-Label');
        if (lab === "Actual") {
            document.getElementById('Prediction-Label').innerHTML = "Predicted";
        } else {
            document.getElementById('Prediction-Label').innerHTML = "Actual"
        };
    })
    

}