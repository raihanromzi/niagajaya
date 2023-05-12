import { Box, Text, Flex, Icon } from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

const WarehouseCard = ({ id, name, manager, city, province }) => {
  return (
    <Box
      as={RouterLink}
      to={`/admin/stock-management/warehouse/${id}`}
      maxW={"sm"}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      mt={2}
      bgColor="white"
      _hover={{
        background: "teal.50",
        color: "teal.500",
      }}>
      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Text fontSize="3xl" fontWeight="bold" mr="2">
            {name}
          </Text>
        </Box>

        <Box mt="2" mb="2">
          <Text fontWeight="medium">Manager: {manager}</Text>
          <Flex align="center" mt={6}>
            <Icon as={FiMapPin} mr="1" />
            <Text fontWeight={"thin"}>
              {city}, {province}
            </Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default WarehouseCard;
