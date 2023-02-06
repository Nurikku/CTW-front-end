import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import { CustomSelect } from "./components/CustomSelect";
import { DishRow } from "./components/DishRow";
import { NumberInput } from "./components/NumberInput";
import { ReviewEntry } from "./components/ReviewEntry";
import {
  MEALS,
  TAB_STEPS,
  TAB_TO_CLASS,
  TAB_TO_TEXT,
  MEAL_TO_NAME,
  UNSET_ENTRY_ID,
} from "./const";
import { getDishesInformation } from "./requests/menuRequest";
import { Dish, DishesJson, SelectedMeal } from "./types/types";

const isNavDisabled = (
  index: number,
  mealIndex: number,
  restaurantIndex: number,
  personCount: number
) => {
  if (mealIndex == UNSET_ENTRY_ID || isNaN(personCount) || personCount < 1) {
    return index > 0;
  }
  if (restaurantIndex == UNSET_ENTRY_ID) {
    return index > 1;
  }
};

const getCorrectedData = (json: DishesJson) => {
  const dishes = json.dishes;
  let count = 0;
  const restaurantToId = new Map<string, number>();
  const restaurantDishes = new Map<number, Array<Dish>>(); // restaurant id to list of dishes
  for (const dish of dishes) {
    const restaurant = dish.restaurant;
    if (restaurantToId.has(restaurant)) {
      const restaurantId = restaurantToId.get(restaurant);
      if (!restaurantId) {
        continue;
      }
      const current = restaurantDishes.get(restaurantId);
      if (!current) {
        continue;
      }
      current.push(dish);
      continue;
    }
    restaurantToId.set(restaurant, count);
    restaurantDishes.set(count, [dish]);
    count += 1;
  }
  return { restaurantToId, restaurantDishes };
};

const getRestaurantsByMeal = (
  restaurantDishes: Map<number, Array<Dish>>,
  meal: string | undefined
) => {
  if (!meal) {
    return [];
  }
  const restaurants = [];
  meal = meal.toLowerCase();
  for (const id of restaurantDishes.keys()) {
    const dishes = restaurantDishes.get(id);
    if (!dishes) {
      continue;
    }
    for (const dish of dishes) {
      const available = dish.availableMeals;
      if (available.includes(meal)) {
        restaurants.push(id);
        break;
      }
    }
  }
  return restaurants;
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState(UNSET_ENTRY_ID);
  const [restaurants, setRestaurants] = useState({
    restaurantToId: new Map<string, number>(),
    restaurantDishes: new Map<number, Dish[]>(),
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(UNSET_ENTRY_ID);
  const [currentStep, setCurrentStep] = useState(TAB_STEPS.MEAL_SELECT);
  const [personCount, setPersonCount] = useState(0);
  const [dishCounts, setDishCounts] = useState(
    new Map<number, Array<number>>([[0, [UNSET_ENTRY_ID, 1]]])
  );
  const [dishes, setDishes] = useState([] as Array<Dish>);
  useEffect(() => {
    getDishesInformation().then((json) => {
      const restaurants = getCorrectedData(json);
      setDishes(json.dishes);
      setRestaurants(restaurants);
    });
  }, []);
  const goToNextStep = () => {
    const stepCount = Object.keys(TAB_STEPS).length;
    const nextStep = (currentStep + 1) % stepCount;
    const isDisabled = isNavDisabled(
      nextStep,
      selectedCategory,
      selectedRestaurant,
      personCount
    );
    if (isDisabled) {
      return;
    }
    setCurrentStep(nextStep);
  };
  const setDishCountById = (rowId: number, id: number, value: number) => {
    const newDishCounts = new Map(dishCounts);
    newDishCounts.set(rowId, [id, value]);
    setDishCounts(newDishCounts);
  };
  const tabKeys = [...TAB_TO_TEXT.keys()];
  const visualSteps = tabKeys.map((key, i) => {
    const isDisabled = isNavDisabled(
      i,
      selectedCategory,
      selectedRestaurant,
      personCount
    );
    let className = currentStep == key ? "selected" : "";
    if (isDisabled) {
      className += " disabled";
    }
    const value = TAB_TO_TEXT.get(key);
    const moveCallback = isDisabled ? () => {} : setCurrentStep.bind(null, key);
    return (
      <li className={className} onClick={moveCallback}>
        {value}
      </li>
    );
  });
  const mainContainerEntryClass =
    "main-container-entry " + TAB_TO_CLASS.get(currentStep);
  const selectedRestaurantIds = getRestaurantsByMeal(
    restaurants.restaurantDishes,
    MEAL_TO_NAME.get(selectedCategory)
  );
  const selectedRestaurantEntries = new Map<number, string>();
  for (const id of selectedRestaurantIds) {
    const dishes = restaurants.restaurantDishes.get(id);
    if (!dishes) {
      continue;
    }
    const someDish = dishes[0];
    selectedRestaurantEntries.set(id, someDish.restaurant);
  }
  const selectedDishes = restaurants.restaurantDishes.get(selectedRestaurant);
  const selectedDishesEntries = new Map<number, string>();
  if (!!selectedDishes) {
    for (const dish of selectedDishes) {
      selectedDishesEntries.set(dish.id, dish.name);
    }
  }
  selectedRestaurantEntries.set(UNSET_ENTRY_ID, "Unselected");
  selectedDishesEntries.set(UNSET_ENTRY_ID, "Unselected");
  const dishRows = [];
  for (const rowId of dishCounts.keys()) {
    const entry = dishCounts.get(rowId);
    if (!entry) {
      continue;
    }
    const [dishId, count] = entry;
    dishRows.push(
      <DishRow
        entries={selectedDishesEntries}
        updateDish={setDishCountById}
        rowId={rowId}
        id={dishId}
        count={count}
        dishCounts={dishCounts}
      />
    );
  }
  const addNewDishRow = () => {
    const tempId = dishCounts.size;
    setDishCountById(tempId, UNSET_ENTRY_ID, 1);
  };
  return (
    <main>
      <h1 className="header">Welcome !</h1>
      <div className="main-container">
        <div className={mainContainerEntryClass}>
          <div className="block meal">
            <CustomSelect
              setSelectCallback={setSelectedCategory}
              entries={MEAL_TO_NAME}
              dataTitle="Please select a meal"
              dishCounts={null}
            />
            <NumberInput
              countCallback={setPersonCount}
              dataTitle="Please input number of persons"
            />
          </div>
          <div className="block restaurant">
            <CustomSelect
              setSelectCallback={setSelectedRestaurant}
              entries={selectedRestaurantEntries}
              dataTitle="Please select a restaurant"
              dishCounts={null}
            />
          </div>
          <div className="block dish">
            <div className="dish-container">{dishRows}</div>
            <div className="dish-footer">
              <div className="add-dish-wrapper" onClick={addNewDishRow}>
                Add dish
              </div>
            </div>
          </div>
          <div className="block review">
            <ReviewEntry
              dishes={dishes}
              selectedDishes={dishCounts}
              dishesNeeded={personCount}
            />
          </div>
        </div>
      </div>
      <div>
        <ol>{visualSteps}</ol>
      </div>
      <div className="footer">
        <button onClick={goToNextStep}>Next</button>
      </div>
    </main>
  );
}

export default App;
