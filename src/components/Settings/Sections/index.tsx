import { FC } from "react";
import "./style.scss";

type Props = {
  title: string;
  children: any;
};
const Section: FC<Props> = ({ title, children }) => {
  return (
    <div className="section">
      <h3 className="section__title">{title}</h3>
      <div className="section__body">{children}</div>
    </div>
  );
};

export default Section;
