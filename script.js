let weightEntries = [];
let firstEntryDate = null;

function loadWeightData() {
    const savedEntries = localStorage.getItem("weightEntries");

    if (savedEntries !== null) {
        weightEntries = JSON.parse(savedEntries);
    }
}
loadWeightData();

function loadFirstEntryDate() {
    const savedFirstEntryDate = localStorage.getItem("firstEntryDate");

    if (savedFirstEntryDate !== null) {
        firstEntryDate = new Date(savedFirstEntryDate);
    }
}
loadFirstEntryDate();

const input = document.getElementById("weightInput");
const button = document.getElementById("saveButton");
const weeklyHistory = document.getElementById("weeklyHistory");

function displayEntry(entry) {
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
        weekStats.id = `week-stats-${entry.week}`;
        weekStats.textContent = "Days Recorded: 0 / 7";
        weekSection.appendChild(weekStats);

        weeklyHistory.appendChild(weekSection);
    }

    // Add the weight entry to its corresponding week section.
    const weightItem = document.createElement("li");
    weightItem.textContent = `${entry.displayDate} - ${entry.weight} lbs`;
    weekSection.appendChild(weightItem);
}

// Display every entry loaded from localStorage.
weightEntries.forEach(function (entry) {
    displayEntry(entry);
});

const weekNumbers = [...new Set(weightEntries.map(function (entry) {
    return entry.week;
}))];

weekNumbers.forEach(function (weekNumber) {
    updateWeeklyStats(weekNumber);
});

function calculateWeeklyAverage(weekNumber) {
    // Filter the history to entries belonging to the current 7 day period.
    const currentWeekEntries = weightEntries.filter(function (entry) {
        return entry.week === weekNumber;
    });

    if (currentWeekEntries.length === 0) {
        return null;
    }

    // Calculate weekly average using only days with recorded weights.
    const weekTotal = currentWeekEntries.reduce (function (total, entry) {
        return total + entry.weight;
    }, 0);

    return weekTotal / currentWeekEntries.length;
}

function calculateWeightChange(weekNumber) {
    if (weekNumber === 1) {
        return null;
    }

    const currentAverage = calculateWeeklyAverage(weekNumber);
    const previousAverage = calculateWeeklyAverage(weekNumber - 1);

    if (currentAverage === null || previousAverage === null) {
        return null;
    }

    return currentAverage - previousAverage;
}

function updateWeeklyStats(weekNumber) {
    // Filter the history to entries belonging to the current 7 day period.
    const currentWeekEntries = weightEntries.filter(function (entry) {
        return entry.week === weekNumber;
    });

    const daysRecorded = currentWeekEntries.length;
    const daysMissed = 7 - daysRecorded;

    const weekAverage = calculateWeeklyAverage(weekNumber)

    const weekStats = document.getElementById(`week-stats-${weekNumber}`);

    const weightChange = calculateWeightChange(weekNumber);

    if (weekStats !== null) {
        let statsText =
            `Average: ${weekAverage.toFixed(1)} lbs | ` +
            `Days Recorded: ${daysRecorded} / 7 | ` +
            `Days Missed: ${daysMissed}`;

        if (weightChange !== null) {
            statsText += ` | Weight Change: ${weightChange.toFixed(1)} lbs`;
        }

        weekStats.textContent = statsText;
    }
}

function calculateWeekNumber(date) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysSinceFirstEntry = Math.floor((date - firstEntryDate) / millisecondsPerDay);

    // Weeks are based on 7 calender days instead of number of entries.
    return Math.floor(daysSinceFirstEntry / 7) + 1;
}

function saveWeightData() {
    localStorage.setItem("weightEntries", JSON.stringify(weightEntries));
}

function saveFirstEntryDate() {
    localStorage.setItem(
        "firstEntryDate",
        firstEntryDate.toISOString()
    );
}

function saveWeight() {
    const weight = input.value;
    const date = new Date();
    const formattedDate = date.toLocaleDateString();

    // Prevents multiple entries on the same day.
    const alreadyLoggedToday = weightEntries.some(function (entry) {
        return entry.displayDate === formattedDate;
    });

    if (alreadyLoggedToday) {
        alert("You already logged your weight today.");
        return;
    }

    // Establish first tracking date.
    if (firstEntryDate === null) {
        firstEntryDate = date;
        saveFirstEntryDate();
    }

    const weekNumber = calculateWeekNumber(date);

    const entry = {
        date: date,
        displayDate: formattedDate,
        weight: Number(weight),
        week: weekNumber
    };
    weightEntries.push(entry);

    saveWeightData();

    displayEntry(entry);
    updateWeeklyStats(weekNumber);

    input.value = "";
}

button.addEventListener("click", saveWeight);