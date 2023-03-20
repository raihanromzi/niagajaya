import { Flex, HStack, Text, Box } from "@chakra-ui/react";
import React from "react";
import Logo from "../components/Logo";

function AdminPage() {
  return (
    <HStack w="full" h="100vh" bg="gray.100">
      <Flex as="aside" w="full" h="full" maxW={350} bg="white" alignItems="center" padding={6} flexDirection="column">
        <Logo />
      </Flex>
      <HStack w="full" h="100vh" bg="gray.100" padding={4}>
        <Flex as="main" w="full" h="full" bg="white" alignItems="center" justifyContent="center" flexDirection="column" position="relative" borderRadius={"2xl"}>
          <Text fontSize={100} color="gray.300">
            Main
          </Text>
        </Flex>
      </HStack>
    </HStack>
  );
}

export default AdminPage;
