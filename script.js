const input = document.getElementById("weightInput");
const button = document.getElementById("saveButton");
const result = document.getElementById("result");

button.addEventListener("click", function() {
    const weight = input.value;

    result.textContent = `Your weight is ${weight} lbs.`;
});