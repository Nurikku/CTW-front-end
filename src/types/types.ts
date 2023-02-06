type MealCategorySelectProps = {
  setMealCategoryCallback: Function;
};

type MealCategorySelectValueContainerProps = {
  setSelectedMeal: Function;
  expanded: boolean;
};

type Dish = {
  id: number;
  name: string;
  restaurant: string;
  availableMeals: Array<string>;
};

type DishesJson = {
  dishes: Array<Dish>;
};

type SelectedMeal = 0 | 1 | 2 | 3;

export type {
  MealCategorySelectProps,
  MealCategorySelectValueContainerProps,
  DishesJson,
  Dish,
  SelectedMeal,
};
