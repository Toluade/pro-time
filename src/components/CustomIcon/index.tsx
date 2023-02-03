import { Icon, Tooltip } from "@chakra-ui/react";
import { FC } from "react";

type Prop = {
  icon: any;
  onClick?: () => void;
  tooltip?: string;
  classes?: string;
};

const CustomIcon: FC<Prop> = ({ icon, onClick, classes, tooltip }) => {
  return (
    <Tooltip
      placement="bottom"
      hasArrow
      label={tooltip}
      bg="gray.300"
      color="black"
    >
      <Icon onClick={onClick} className={` icon ${classes}`} as={icon} />
    </Tooltip>
  );
};

export default CustomIcon;
