const input = document.getElementById("weightInput");
const button = document.getElementById("saveButton");
const weightHistory = document.getElementById("weightHistory");

// Take user input and add to unordered list in html
button.addEventListener("click", function() {
    const weight = input.value;

    const listItem = document.createElement("li");

    listItem.textContent = `${weight} lbs`;

    weightHistory.appendChild(listItem);

    input.value = "";
});