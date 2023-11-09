import { FormEvent, forwardRef, memo, useState } from "react";
import "./style.scss";
import { minuteToMillisecond, secondsToMilliseconds } from "../../utils/util";

type Props = {
  setContDownTime: (value: number) => void;
};

const TimerForm = forwardRef<any, Props>(({ setContDownTime }, ref) => {
  const [inputValue, setInputValue] = useState<any>("");

  const units = ["Seconds", "Minutes"];
  const [unit, setUnit] = useState(units[0]);

  const handleUnitChange = (e: FormEvent<HTMLSelectElement>) => {
    setUnit(e.currentTarget.value);
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (unit === "Seconds") {
      setContDownTime(secondsToMilliseconds(parseInt(inputValue)));
    } else if (unit === "Minutes") {
      setContDownTime(minuteToMillisecond(parseInt(inputValue)));
    }
  };
  return (
    <>
      <div className="form__body">
        <p className="form__title">Set Time</p>
        <form
          className="form"
          action=""
          // onSubmit={() => setContDownTime(inputValue)}
        >
          <div className="form__group">
            <input
              className="form__input"
              ref={ref}
              required
              name="minutes"
              type="number"
              autoFocus
              value={inputValue}
              onChange={handleChange}
            />
            <select
              value={unit}
              onChange={handleUnitChange}
              className="form__label"
            >
              {units?.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <button className="form__submit" type="submit" onClick={onSubmit}>
            Set
          </button>
        </form>
      </div>
    </>
  );
});

export default memo(TimerForm);
