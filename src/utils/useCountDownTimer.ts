import { useState, useEffect } from "react";

/**
 * This is a hook that returns a countdown timer
 * @param {number} inputValue - The value inputer on the form
 * @param {boolean} isFormated - Set if return value should have a leading zero for single digit numbers
 *
 * @returns {obj} { hours, minutes, seconds }
 */

const useCountDownTimer = (inputValue: number, isFormated: boolean) => {
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeUp, setTImeUp] = useState<boolean>(false);

  const [countDown, setCountDown] = useState(300000);

  const startTimer = () => setTimerStarted(true);
  const pauseTimer = () => {
    setTimerStarted(false);
    setIsPaused(false);
  };
  const resumeTimer = () => setIsPaused(false);
  const stopTimer = () => {
    if (!timerStarted) {
      setCountDown(inputValue * 60 * 1000);
    } else {
      setCountDown((count) => count - count);
      setTimerStarted(false);
    }
  };

  const resetTimer = () => setCountDown(inputValue * 60 * 1000);

  useEffect(() => {
    if (countDown === 0) {
      setTImeUp(true);
      setTimerStarted(false);
    } else {
      setTImeUp(false);
    }
  }, [countDown]);

  return {
    ...(isFormated
      ? zeroFormat(getReturnValues(countDown))
      : getReturnValues(countDown)),
    resetTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    timerStarted,
    isPaused,
    timeUp,
    countDown,
    setCountDown,
  };
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const zeroFormat = (obj: any) => {
  const objVal = { ...obj };

  Object.keys(objVal).forEach(function (key) {
    objVal[key] = addZero(objVal[key]);
  });

  return objVal;
};

const addZero = (val: any) => {
  return val < 10 ? "0" + val : val;
};

export default useCountDownTimer;
