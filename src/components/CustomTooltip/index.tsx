import { Tooltip } from "@chakra-ui/react";

type Props = {
  children: any;
  label: any;
};

const CustomTooltip = ({ children, label }: Props) => {
  return (
    <Tooltip
      placement="bottom"
      hasArrow
      label={label}
      bg="gray.300"
      color="black"
    >
      <button tabIndex={-1} style={{ border: "none", outline: "none" }}>
        {children}
      </button>
    </Tooltip>
  );
};

export default CustomTooltip;
