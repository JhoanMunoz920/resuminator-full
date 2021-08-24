import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import React from "react";
import ColoredDivider from "../../components/common/ColoredDivider";
import useGlobalStore from "../../store/global.store";
import ResumePaper from "../Resume";
import AutoSaveStatus from "./AutoSaveStatus";
import OverflowWarning from "./OverflowWarning";

interface ViewerProps {
  withStatus?: boolean;
}

const Viewer: React.FC<ViewerProps> = ({ withStatus }) => {
  const contentOverflow = useGlobalStore((state) => state.contentOverflow);

  return (
    <>
      <Flex justifyContent="space-between">
        {withStatus ? <AutoSaveStatus /> : null}
        {contentOverflow ? <OverflowWarning /> : null}
      </Flex>
      <Box
        borderRadius="10px"
        bg={useColorModeValue("white", "inherit")}
        shadow={useColorModeValue("lg", "2xl")}
        width="21cm"
        height="29.7cm"
        overflowY="auto"
        className="viewer"
        position="relative"
      >
        <ResumePaper />
        {contentOverflow ? (
          <ColoredDivider
            color="yellow.500"
            position="absolute"
            zIndex="1"
            top="29.7cm"
          />
        ) : null}
      </Box>
    </>
  );
};

export default Viewer;
