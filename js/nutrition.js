let nutritionEntries = [];

const calorieInput = document.getElementById("calorieInput");
const proteinInput = document.getElementById("proteinInput");
const foodSaveButton = document.getElementById("foodSaveButton");
const dailyCalories = document.getElementById("dailyCalories");
const dailyProtein = document.getElementById("dailyProtein");
const foodHistory = document.getElementById("foodHistory");
const calorieGoalInput = document.getElementById("calorieGoalInput");
const proteinGoalInput = document.getElementById("proteinGoalInput");
const saveGoalsButton = document.getElementById("saveGoalsButton");
const calorieProgressText = document.getElementById("calorieProgressText");
const proteinProgressText = document.getElementById("proteinProgressText");
const calorieProgressBar = document.getElementById("calorieProgressBar");
const proteinProgressBar = document.getElementById("proteinProgressBar");

function loadNutritionData() {
    const savedNutrition = localStorage.getItem("nutritionEntries");

    if (savedNutrition !== null) {
        nutritionEntries = JSON.parse(savedNutrition);
    }
}
loadNutritionData();

function loadGoals() {
    const savedCalorieGoal = localStorage.getItem("calorieGoal");
    const savedProteinGoal = localStorage.getItem("proteinGoal");

    if (savedCalorieGoal !== null) {
        calorieGoalInput.value = savedCalorieGoal;
    }

    if (savedProteinGoal !== null) {
        proteinGoalInput.value = savedProteinGoal;
    }
}
loadGoals();

function getTodayDate() {
    return new Date().toLocaleDateString();
}

function calculateDailyNutrition() {
    const today = getTodayDate();

    const todayEntries = nutritionEntries.filter(function (entry) {
        return entry.date === today;
    });

    const totalCalories = todayEntries.reduce(function (total, entry) {
        return total + entry.calories;
    }, 0);

    const totalProtein = todayEntries.reduce(function (total, entry) {
        return total + entry.protein;
    }, 0);

    return {
        calories: totalCalories, 
        protein: totalProtein
    };
}

function calculateGoalProgress() {
    const dailyNutrition = calculateDailyNutrition();

    const calorieGoal = Number(localStorage.getItem("calorieGoal"));
    const proteinGoal = Number(localStorage.getItem("proteinGoal"));

    // Prevent division by zero when goals haven't been set.
    if (calorieGoal <= 0 || proteinGoal <= 0) {
        return null;
    }

    const calorieProgress = (dailyNutrition.calories / calorieGoal) * 100;
    const proteinProgress = (dailyNutrition.protein / proteinGoal) * 100;

    return {
        calorieProgress: calorieProgress,
        proteinProgress: proteinProgress
    };
}

function updateGoalProgress() {
    const progress = calculateGoalProgress();

    // Handle users who haven't set their goals yet.
    if (progress === null) {
        calorieProgressText.textContent = "Calories: No goal set";
        proteinProgressText.textContent = "Protein: No goal set";

        calorieProgressBar.value = 0;
        proteinProgressBar.value = 0;
        return;
    }

    // Display the actual percentages.
    calorieProgressText.textContent =
        `Calories: ${progress.calorieProgress.toFixed(1)}%`;

    proteinProgressText.textContent =
        `Protein: ${progress.proteinProgress.toFixed(1)}%`;

    // Limit the visual bars to 100%.
    calorieProgressBar.value = Math.min(progress.calorieProgress, 100);
    proteinProgressBar.value = Math.min(progress.proteinProgress, 100);
}

function displayFoodEntry(entry) {
    const foodItem = document.createElement("p");

    foodItem.textContent = `${entry.calories} calories | ${entry.protein} g protein`;

    foodHistory.appendChild(foodItem);
}
nutritionEntries.forEach(function (entry) {
    if (entry.date == getTodayDate()) {
        displayFoodEntry(entry);
    }
});

const dailyNutritionOnLoad = calculateDailyNutrition();

dailyCalories.textContent = `Calories: ${dailyNutritionOnLoad.calories}`;
dailyProtein.textContent = `Protein: ${dailyNutritionOnLoad.protein}`;

function saveFood() {
    const calorieValue = calorieInput.value.trim();
    const proteinValue = proteinInput.value.trim();

    // Make sure neither field is empty.
    if (calorieValue === "" || proteinValue === "") {
        alert("Please enter both calories and protein.");
        return;
    }

    const calories = Number(calorieValue);
    const protein = Number(proteinValue);

    // Reject negative or non-finite numbers.
    if (!Number.isFinite(calories) || !Number.isFinite(protein) ||
        calories < 0 || protein < 0) {
        alert("Please enter valid, non-negative numbers.");
        return;
    }

    // Prevent unrealistic entries.
    if (calories > 10000 || protein > 1000) {
        alert("Please check your calorie and protein values.");
        return;
    }

    const date = getTodayDate();

    const entry = {
        date: date,
        calories: calories,
        protein: protein
    };

    nutritionEntries.push(entry)
    
    localStorage.setItem("nutritionEntries", JSON.stringify(nutritionEntries));

    const dailyNutrtition = calculateDailyNutrition()

    dailyCalories.textContent = `Calories: ${dailyNutrtition.calories}`;
    dailyProtein.textContent = `Protein: ${dailyNutrtition.protein} g`;

    displayFoodEntry(entry);
    updateGoalProgress();

    calorieInput.value = "";
    proteinInput.value = "";
}

function saveGoals() {
    const calorieValue = calorieGoalInput.value.trim();
    const proteinValue = proteinGoalInput.value.trim();

    // Ensure both fields have values.
    if (calorieValue === "" || proteinValue === "") {
        alert("Please enter both calorie and protein goals.");
        return;
    }

    const calorieGoal = Number(calorieValue);
    const proteinGoal = Number(proteinValue);

    // Goals must be positive, finite numbers.
    if (!Number.isFinite(calorieGoal) || !Number.isFinite(proteinGoal) ||
        calorieGoal <= 0 || proteinGoal <= 0) {
        alert("Goals must be greater than zero.");
        return;
    }

    // Save goals to local storage.
    localStorage.setItem("calorieGoal", calorieGoal);
    localStorage.setItem("proteinGoal", proteinGoal);
    updateGoalProgress();
}

saveGoalsButton.addEventListener("click", saveGoals);
foodSaveButton.addEventListener("click", saveFood);
updateGoalProgress();