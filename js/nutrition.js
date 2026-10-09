let nutritionEntries = [];

const calorieInput = document.getElementById("calorieInput");
const proteinInput = document.getElementById("proteinInput");
const foodSaveButton = document.getElementById("foodSaveButton");
const dailyCalories = document.getElementById("dailyCalories");
const dailyProtein = document.getElementById("dailyProtein");
const foodHistory = document.getElementById("foodHistory");

function loadNutritionData() {
    const savedNutrition = localStorage.getItem("nutritionEntries");

    if (savedNutrition !== null) {
        nutritionEntries = JSON.parse(savedNutrition);
    }
}
loadNutritionData();

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
    const calories = Number(calorieInput.value);
    const protein = Number(proteinInput.value);
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

    calorieInput.value = "";
    proteinInput.value = "";
}

foodSaveButton.addEventListener("click", saveFood);