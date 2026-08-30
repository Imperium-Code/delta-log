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