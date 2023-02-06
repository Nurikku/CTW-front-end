import { useEffect, useState } from "react";
import {
  MealCategorySelectProps,
  MealCategorySelectValueContainerProps,
  SelectedMeal,
} from "../types/types";
import { getDishesInformation } from "../requests/menuRequest";
import { MEALS, MEAL_TO_NAME, UNSET_ENTRY_ID } from "../const";

function SelectValueContainer(props: {
  setSelectCallback: Function;
  expanded: boolean;
  entries: Map<number, string>;
}) {
  const setSelectedCallback = props.setSelectCallback;
  const expanded = props.expanded;
  const entries = props.entries;
  const ids = [...entries.keys()];
  const setSelected = (id: number) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedCallback(id);
    };
  };
  const selectRows = ids.map((id) => (
    <div onClick={setSelected(id)}>{entries.get(id)}</div>
  ));
  const className = "select-container" + (expanded ? " expanded" : "");
  return <div className={className}>{selectRows}</div>;
}

function CustomSelect(props: {
  setSelectCallback: Function;
  entries: Map<number, string>;
  dataTitle: string;
  dishCounts: Map<number, Array<number>> | null;
}) {
  const entries = props.entries;
  if (entries.size == 0) {
    return <></>;
  }
  const dishCounts = props.dishCounts;
  let filteredDishEntries = new Map();
  const takenDishIds = new Set();
  if (dishCounts) {
    for (const rowId of dishCounts.keys()) {
      const entry = dishCounts.get(rowId);
      if (!entry) continue;
      const [dishId, count] = entry;
      takenDishIds.add(dishId);
    }
    for (const dishId of entries.keys()) {
      if (takenDishIds.has(dishId)) continue;
      filteredDishEntries.set(dishId, entries.get(dishId));
    }
  } else {
    filteredDishEntries = entries;
  }
  const [selected, setSelected] = useState(UNSET_ENTRY_ID);
  const [expanded, setExpanded] = useState(false);
  const flipExpandedState = (event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };
  const setSelectedGrouped = (selected: SelectedMeal) => {
    setSelected(selected);
    props.setSelectCallback(selected);
    setExpanded(false);
  };
  document.addEventListener("click", () => {
    setExpanded(false);
  });
  const value = entries.get(selected);
  return (
    <div className="select" data-title={props.dataTitle}>
      <div className="select-value" onClick={flipExpandedState}>
        {value}
      </div>
      <SelectValueContainer
        setSelectCallback={setSelectedGrouped}
        expanded={expanded}
        entries={filteredDishEntries}
      />
    </div>
  );
}

export { CustomSelect };
