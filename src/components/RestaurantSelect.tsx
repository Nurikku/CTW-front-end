import { useEffect, useState } from "react";
import {
  MealCategorySelectProps,
  MealCategorySelectValueContainerProps,
  SelectedMeal,
} from "../types/types";
import { getDishesInformation } from "../requests/menuRequest";
import { MEALS, MEAL_TO_NAME } from "../const";

function MealCategorySelectValueContainer(
  props: MealCategorySelectValueContainerProps
) {
  const setSelectedMealCallback = props.setSelectedMeal;
  const expanded = props.expanded;
  const selectRows = [] as Array<JSX.Element>;
  const setSelectedMeal = (mealId: number) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedMealCallback(mealId);
    };
  };
  for (const key of MEAL_TO_NAME.keys()) {
    const name = MEAL_TO_NAME.get(key);
    const row = <div onClick={setSelectedMeal(key)}>{name}</div>;
    selectRows.push(row);
  }
  const className = "select-container" + (expanded ? " expanded" : "");
  return <div className={className}>{selectRows}</div>;
}

function MealCategorySelect(props: MealCategorySelectProps): JSX.Element {
  const [selectedMeal, setSelectedMeal] = useState(-1 as SelectedMeal);
  const [expanded, setExpanded] = useState(false);
  const flipExpandedState = (event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };
  const setSelectedCallback = (selected: SelectedMeal) => {
    setSelectedMeal(selected);
    props.setMealCategoryCallback(selected);
    setExpanded(false);
  };
  document.addEventListener("click", () => {
    setExpanded(false);
  });
  return (
    <div className="select" data-title={"Please select a meal"}>
      <div className="select-value" onClick={flipExpandedState}>
        {MEAL_TO_NAME.get(selectedMeal)}
      </div>
      <MealCategorySelectValueContainer
        setSelectedMeal={setSelectedCallback}
        expanded={expanded}
      />
    </div>
  );
}

export { MealCategorySelect };
