import { Dispatch, SetStateAction, useEffect } from "react";
import worker_script from "./worker-script";

const timerWorker = new Worker(worker_script);

const useInterval = (
  timerStarted: boolean,
  setCountDown: Dispatch<SetStateAction<number>>
) => {
  useEffect(() => {
    timerWorker.onmessage = ({ data: { time } }) => {
      setCountDown((count) => (count > 0 ? count - time : count));
    };
  }, []);

  useEffect(() => {
    if (timerStarted) {
      timerWorker.postMessage({ turn: "on" });
    } else {
      timerWorker.postMessage({ turn: "off" });
    }
  }, [timerStarted]);
};

export default useInterval;
