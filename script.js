let weightEntries = [];

const input = document.getElementById("weightInput");
const button = document.getElementById("saveButton");
const weightHistory = document.getElementById("weightHistory");
const averageWeight = document.getElementById("averageWeight");

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

    // Calculate averages of weight entries.
    const totalWeight = weightEntries.reduce(function (total, entry) {
        return total + entry.weight;
    }, 0);
    const average = totalWeight / weightEntries.length;
    averageWeight.textContent = `Average Weight: ${average.toFixed(1)} lbs`;

    const listItem = document.createElement("li");
    listItem.textContent = `${formattedDate} - ${weight} lbs`;
    weightHistory.appendChild(listItem);

    input.value = "";
});