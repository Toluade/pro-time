import { FC } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: any;
  title: string;
  placement?: any;
  children: any;
  focusRef?: any;
};

const CustomDrawer: FC<Props> = ({
  isOpen,
  onClose,
  title,
  placement = "right",
  children,
  focusRef = null,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement={placement}
      size="xs"
      onClose={onClose}
      finalFocusRef={focusRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        {/* <DrawerFooter>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
