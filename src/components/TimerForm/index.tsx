import { FormEvent, forwardRef, memo, useEffect, useState } from "react";
import "./style.scss";
import { minuteToMillisecond, secondsToMilliseconds } from "../../utils/util";
import { Switch } from "@chakra-ui/react";
import { feature } from "../../utils/storedItems";

type Props = {
  setContDownTime: (value: number) => void;
  toggleOneBg: () => void;
  oneBg: boolean;
};

const TimerForm = forwardRef<any, Props>(
  ({ setContDownTime, toggleOneBg, oneBg }, ref) => {
    const [inputValue, setInputValue] = useState<any>("");

    const units = Object.values(feature.UNIT.options);
    const [unit, setUnit] = useState(
      localStorage.getItem(feature.UNIT.name) ?? units[0]
    );

    const handleUnitChange = (e: FormEvent<HTMLSelectElement>) => {
      localStorage.setItem(feature.UNIT.name, e.currentTarget.value);
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

    useEffect(() => {
      const form = document.getElementById("form");

      form?.addEventListener("dblclick", (event) => {
        event.stopPropagation();
      });

      return () =>
        form?.removeEventListener("dblclick", (event) => {
          event.stopPropagation();
        });
    }, []);

    const oneBgExpired = localStorage.getItem(feature.ONE_BG.name) === "true";
    return (
      <>
        <div id="form" className="form__body">
          <h2 className="form__title">Set Time</h2>
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
                className="form__select"
              >
                {units?.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div
              title="Use a single background for your timer (black for dark mode and white for light mode)."
              className="form__group"
            >
              <label className="form__label" htmlFor="">
                One background
              </label>
              <Switch
                size="md"
                colorScheme="whatsapp"
                style={{ outline: "none" }}
                isChecked={oneBg}
                onChange={toggleOneBg}
              />
              {!oneBgExpired && <span className="badge">NEW</span>}
            </div>
            <button className="form__submit" type="submit" onClick={onSubmit}>
              Set
            </button>
          </form>
        </div>
      </>
    );
  }
);

export default memo(TimerForm);
