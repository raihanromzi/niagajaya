import { Box, Flex, FormLabel, IconButton, Input } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

const ProfileItem = ({ id, label, value, handleClick }) => {
  return (
    <Box w="full">
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Flex>
        <Input
          id={id}
          value={value}
          variant="filled"
          borderRightRadius="none"
          isDisabled
        />
        <IconButton
          icon={<FaEdit />}
          ml={1}
          borderLeftRadius="none"
          onClick={handleClick}
        />
      </Flex>
    </Box>
  );
};

export default ProfileItem;
