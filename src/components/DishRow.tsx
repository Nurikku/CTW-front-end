import { useState } from "react";
import { UNSET_ENTRY_ID } from "../const";
import { CustomSelect } from "./CustomSelect";
import { NumberInput } from "./NumberInput";

function DishRow(props: {
  updateDish: Function;
  entries: Map<number, string>;
  rowId: number;
  id: number;
  count: number;
  dishCounts: Map<number, Array<number>>;
}) {
  const [dishId, setDishId] = useState(props.id);
  const [dishCount, setDishCount] = useState(props.count);
  const rowId = props.rowId;
  const _setDishId = (id: number) => {
    setDishId(id);
    if (!dishCount) {
      return;
    }
    props.updateDish(rowId, id, dishCount);
  };
  const _setDishCount = (count: number) => {
    setDishCount(count);
    if (!dishId) {
      return;
    }
    props.updateDish(rowId, dishId, count);
  };
  return (
    <div className="selected-dish-row">
      <CustomSelect
        setSelectCallback={_setDishId}
        entries={props.entries}
        dataTitle="Please select a dish"
        dishCounts={props.dishCounts}
      />
      <NumberInput
        countCallback={_setDishCount}
        dataTitle="Please input number of dishes"
      />
    </div>
  );
}

export { DishRow };
