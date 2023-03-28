import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";

function Logo() {
  return (
    <Flex w="full" alignItems="center" flexDirection="column" gap={4}>
      <Box display="flex" justifyContent="center" gap={2}>
        <Text fontWeight="bold" fontSize={16}>
          NIAGAJAYA
        </Text>
      </Box>
    </Flex>
  );
}

export default Logo;
