// Application initialization and Shared UI updates

import { initializeWeight } from "./weight.js";
import { initializeNutrition } from "./nutrition.js";
import { initializeGoals, updateGoalProgress } from "./goals.js";

initializeWeight();
initializeNutrition(updateGoalProgress);
initializeGoals();