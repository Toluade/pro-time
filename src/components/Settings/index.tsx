import { FC } from "react";
import Section from "./Sections";
import Display from "./Sections/Display";

const Settings: FC = () => {
  return (
    <div>
      <Section title="Display Preferences">
        <Display />
      </Section>
    </div>
  );
};

export default Settings;
