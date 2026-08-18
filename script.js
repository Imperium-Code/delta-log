let weightEntries = [];
let firstEntryDate = null;

// Load saved weight entries when the application starts.
const savedEntries = localStorage.getItem("weightEntries");

if (savedEntries !== null) {
    weightEntries = JSON.parse(savedEntries);
}

// Restore the date that established the user's first 7 day tracking cycle.
const savedFirstEntryDate = localStorage.getItem("firstEntryDate");

if (savedFirstEntryDate !== null) {
    firstEntryDate = new Date(savedFirstEntryDate);
}

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

    // First weigh in established beginning of the user's 7 day cycle.
    if (firstEntryDate === null) {
        firstEntryDate = date;

        // Save the first entry date so the 7 day tracking cycle persists between sessions.
        localStorage.setItem("firstEntryDate", firstEntryDate.toISOString());
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysSinceFirstEntry = Math.floor((date - firstEntryDate) / millisecondsPerDay);

    // Weeks are based on 7 calender days instead of number of entries.
    const weekNumber = Math.floor(daysSinceFirstEntry / 7) + 1;

    const entry = {
        date: date,
        displayDate: formattedDate,
        weight: Number(weight),
        week: weekNumber
    };
    weightEntries.push(entry);

    // Save the updated weight history so entries persist between sessions.
    localStorage.setItem("weightEntries", JSON.stringify(weightEntries));

    // Filter the history to entries belonging to the current 7 day period.
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

    // Add the new entry to weekly history display.
    let weekSection = document.getElementById(`week-${entry.week}`);
    
    // Create a new week section when this is the first entry for that week.
    if (weekSection === null) {
        weekSection = document.createElement("div");
        weekSection.id = `week-${entry.week}`;

        const weekHeading = document.createElement("h3");
        weekHeading.textContent = `Week ${entry.week}`;
        weekSection.appendChild(weekHeading);

        const weekStats = document.createElement("p");
        weekStats.textContent = "Days Recorded: 0 / 7";
        weekSection.appendChild(weekStats);

        weeklyHistory.appendChild(weekSection);
    }

    // Add the weight entry to its corresponding week section.
    const weightItem = document.createElement("li");
    weightItem.textContent = `${entry.displayDate} - ${entry.weight} lbs`;
    weekSection.appendChild(weightItem);

    input.value = "";
});