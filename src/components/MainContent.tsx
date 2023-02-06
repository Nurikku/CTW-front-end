import { useEffect, useState } from "react";
import { MEALS } from "../const";
import { getDishesInformation } from "../requests/menuRequest";

const MainArea = () => {
  const meals = Object.values(MEALS);
  const [mealCategory, setMealCategory] = useState();
  useEffect(() => {
    getDishesInformation().then((dishesJson) => {
      const categories = [] as Array<string>;
      const restaurants = dishesJson.dishes;
      for (const restaurant of restaurants) {
        for (const meal of restaurant.availableMeals) {
          if (categories.includes(meal)) {
            continue;
          }
          categories.push(meal);
        }
      }
      categories.sort((a, b) => a.localeCompare(b));
    });
  }, []);
  return <div></div>;
};
