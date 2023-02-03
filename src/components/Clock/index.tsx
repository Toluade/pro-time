import useClock from "../../utils/useClock";

const Clock = () => {
  const time = useClock();
  return <p className="clock">{time}</p>;
};

export default Clock;
