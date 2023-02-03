import { useContext } from "react";
import { SettingsContext } from "../../../Home";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const Display = () => {
  const { displayModes, displayPreference, setDisplayPreference } =
    useContext(SettingsContext);
  return (
    <RadioGroup
      name="display_preferences"
      onChange={setDisplayPreference}
      value={displayPreference}
      colorScheme="purple"
    >
      <Stack direction="column">
        <Radio value={displayModes?.systemDefault}>System default</Radio>
        <Radio value={displayModes?.lightMode}>Light mode</Radio>
        <Radio value={displayModes?.darkMode}>Dark mode</Radio>
      </Stack>
    </RadioGroup>
  );
};

export default Display;
