import { Dispatch, SetStateAction, useEffect } from "react";

const useInterval = (
  timerStarted: boolean,
  countDown: number,
  setCountDown: Dispatch<SetStateAction<number>>
) => {
  useEffect(() => {
    if (!timerStarted) return;
    // console.log("It started");
    let countDownId = setInterval(() => {
      setCountDown((count) => (count > 0 ? count - 1000 : count));

      if (countDown === 1) {
        clearInterval(countDownId);
      }
    }, 1000);

    return function cleanup() {
      clearInterval(countDownId);
    };
  }, [timerStarted, countDown]);
};

export default useInterval;
