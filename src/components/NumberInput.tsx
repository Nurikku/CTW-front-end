import { LegacyRef, useState } from "react";

function NumberInput(props: {
  countCallback: Function;
  id?: number;
  dataTitle: string;
}) {
  const [value, setValue] = useState(0);
  const setValueCallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toSet = parseInt(e.target.value);
    setValue(toSet);
    if (typeof props.id != "undefined") {
      console.log("input", toSet, props.id);
      props.countCallback(toSet, props.id);
      return;
    }
    props.countCallback(toSet);
  };
  return (
    <div className="number-of-people-holder" data-title={props.dataTitle}>
      <input type="number" value={value} onChange={setValueCallback}></input>
    </div>
  );
}

export { NumberInput };
