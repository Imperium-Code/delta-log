let weightEntries = [];
let firstEntryDate = null;

const input = document.getElementById("weightInput");
const button = document.getElementById("saveButton");
const weeklyHistory = document.getElementById("weeklyHistory");
const averageWeight = document.getElementById("averageWeight");
const daysRecordedDisplay = document.getElementById("daysRecorded");
const daysMissedDisplay = document.getElementById("daysMissed");

// Handles weight submission and updates the current week's information.
button.addEventListener("click", function() {
    const weight = input.value;
    const date = new Date();
    const formattedDate = date.toLocaleDateString();

    // Prevents multiple entries on the same day.
    const alreadyLoggedToday = weightEntries.some(function (entry) {
        return entry.displayDate === formattedDate
    });

    if (alreadyLoggedToday) {
        alert("You already logged your weight today.");
        return;
    }

    // First entry becomes start of the week.
    if (firstEntryDate === null) {
        firstEntryDate = date;
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysSinceFirstEntry = Math.floor((date - firstEntryDate) / millisecondsPerDay);

    // Weeks are based on 7 calender days instead of # of entries.
    const weekNumber = Math.floor(daysSinceFirstEntry / 7) + 1;

    const entry = {
        date: date,
        displayDate: formattedDate,
        weight: Number(weight),
        week: weekNumber
    };
    weightEntries.push(entry);

    // Only gather entries that belong to current week.
    const currentWeekEntries = weightEntries.filter(function (entry) {
        return entry.week === weekNumber;
    });

    const daysRecorded = currentWeekEntries.length;
    const daysMissed = 7 - daysRecorded;

    daysRecordedDisplay.textContent = `Days Recorded: ${daysRecorded} / 7`;
    daysMissedDisplay.textContent = `Days Missed: ${daysMissed}`;

    // Calculate avg using only days where an entry was provided.
    const weekTotal = currentWeekEntries.reduce(function (total, entry) {
        return total + entry.weight;
    }, 0);

    const weekAverage = weekTotal / currentWeekEntries.length;

    averageWeight.textContent = `Week ${weekNumber} Average: ${weekAverage.toFixed(1)} lbs`;

    // Display new entry to the visible weight history.
    let weekSection = document.getElementById(`week-${entry.week}`);
    
    // Create new week on display if first day of week.
    if (weekSection === null) {
        weekSection = document.createElement("div");
        weekSection.id = `week-${entry.week}`;

        const weekHeading = document.createElement("h3");
        weekHeading.textContent = `Week ${entry.week}`;
        weekSection.appendChild(weekHeading);

        weeklyHistory.appendChild(weekSection);
    }

    // List weights under current week.
    const weightItem = document.createElement("li");
    weightItem.textContent = `${entry.displayDate} - ${entry.weight} lbs`;
    weekSection.appendChild(weightItem);

    input.value = "";
});