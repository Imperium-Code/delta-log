let weightEntries = [];

const input = document.getElementById("weightInput");
const button = document.getElementById("saveButton");
const weightHistory = document.getElementById("weightHistory");

// User Input added to html list, and weightEntries array.
button.addEventListener("click", function() {
    const weight = input.value;

    const date = new Date();
    const formattedDate = date.toLocaleDateString();

    const entry = {
        date: formattedDate,
        weight: Number(weight)
    };
    weightEntries.push(entry);

    const listItem = document.createElement("li");

    listItem.textContent = `${formattedDate} - ${weight} lbs`;

    weightHistory.appendChild(listItem);

    input.value = "";
});