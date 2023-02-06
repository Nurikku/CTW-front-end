import { Dish } from "../types/types";

const ReviewEntry = (props: {
  selectedDishes: Map<number, Array<number>>;
  dishes: Array<Dish>;
  dishesNeeded: number;
}) => {
  const dishCounts = props.selectedDishes;
  const dishes = props.dishes;
  const dishRows = [];
  let total = 0;
  for (const rowId of dishCounts.keys()) {
    const entry = dishCounts.get(rowId);
    if (!entry) {
      continue;
    }
    const [dishId, count] = entry;
    const dish = dishes[dishId - 1];
    if (!dish) {
      continue;
    }
    total += count;
    dishRows.push(
      <div className="selected-dish-row">
        <span>{dish.name}</span>
        <span>{count}</span>
      </div>
    );
  }
  dishRows.push(
    <div className="selected-dish-row">
      <span className={props.dishesNeeded >= total ? "green" : "red"}>
        Total
      </span>
      <span>{total}</span>
    </div>
  );
  return <div className="dish-container">{dishRows}</div>;
};

export { ReviewEntry };
