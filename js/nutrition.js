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