// Calorie/Protein targets and Progress tracking

import { calculateDailyNutrition } from "./nutrition.js";

const calorieGoalInput = document.getElementById("calorieGoalInput");
const proteinGoalInput = document.getElementById("proteinGoalInput");
const saveGoalsButton = document.getElementById("saveGoalsButton");

const calorieProgressText = document.getElementById("calorieProgressText");
const proteinProgressText = document.getElementById("proteinProgressText");

const calorieProgressBar = document.getElementById("calorieProgressBar");
const proteinProgressBar = document.getElementById("proteinProgressBar");

const remainingCaloriesText = document.getElementById("remainingCalories");
const remainingProteinText = document.getElementById("remainingProtein");

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

    const remainingCalories = calorieGoal - dailyNutrition.calories;
    const remainingProtein = proteinGoal - dailyNutrition.protein;

    return {
        calorieProgress: calorieProgress,
        proteinProgress: proteinProgress,
        remainingCalories: remainingCalories,
        remainingProtein: remainingProtein
    };
}

export function updateGoalProgress() {
    const progress = calculateGoalProgress();

    // Handle users who haven't set their goals yet.
    if (progress === null) {
        calorieProgressText.textContent = "Calories: No goal set";
        proteinProgressText.textContent = "Protein: No goal set";

        calorieProgressBar.value = 0;
        proteinProgressBar.value = 0;

        remainingCaloriesText.textContent = "Calories Remaining: --";
        remainingProteinText.textContent = "Protein Remaining: --";

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

    // Display remaining calories and protein.
    remainingCaloriesText.textContent =
        `Calories Remaining: ${progress.remainingCalories.toFixed(1)}`;

    remainingProteinText.textContent =
        `Protein Remaining: ${progress.remainingProtein.toFixed(1)} g`;
}

export function initializeGoals() {
    loadGoals();

    saveGoalsButton.addEventListener("click", saveGoals);

    updateGoalProgress();
}