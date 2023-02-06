const TAB_STEPS = {
  MEAL_SELECT: 0,
  RESTAURANT_SELECT: 1,
  DISH_SELECT: 2,
  REVIEW: 3,
};

const MEALS = Object.freeze({
  UNSET: 0,
  BREAKFAST: 1,
  LUNCH: 2,
  DINNER: 3,
});

const UNSET_ENTRY_ID = -1;

const MEAL_TO_NAME = new Map([
  [UNSET_ENTRY_ID, "Unselected"],
  [MEALS.BREAKFAST, "Breakfast"],
  [MEALS.LUNCH, "Lunch"],
  [MEALS.DINNER, "Dinner"],
]);

const TAB_TO_CLASS = new Map([
  [TAB_STEPS.MEAL_SELECT, "meal"],
  [TAB_STEPS.RESTAURANT_SELECT, "restaurant"],
  [TAB_STEPS.DISH_SELECT, "dish"],
  [TAB_STEPS.REVIEW, "review"],
]);

const TAB_TO_TEXT = new Map([
  [TAB_STEPS.MEAL_SELECT, "Select a meal"],
  [TAB_STEPS.RESTAURANT_SELECT, "Select a restaurant"],
  [TAB_STEPS.DISH_SELECT, "Select a dish"],
  [TAB_STEPS.REVIEW, "Review"],
]);

export {
  MEALS,
  MEAL_TO_NAME,
  TAB_STEPS,
  TAB_TO_CLASS,
  TAB_TO_TEXT,
  UNSET_ENTRY_ID,
};
