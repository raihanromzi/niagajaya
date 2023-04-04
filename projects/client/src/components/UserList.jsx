import React from "react";
import { useGetAllUserQuery } from "../redux/store";
import { Spinner, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex, Box, Center, Input, InputGroup, InputRightElement, IconButton, Skeleton, Stack, Text } from "@chakra-ui/react";

function UserList() {
  const { data, isError, isLoading } = useGetAllUserQuery();

  const tableHead = [
    { name: "Id", width: "5em" },
    { name: "Email", width: "60em" },
    { name: "Name", width: "40em" },
    { name: "Role", width: "20em" },
  ];

  let contentUser;

  if (isLoading) {
    contentUser = <Spinner />;
  } else if (isError) {
    contentUser = <div>Error loading albums.</div>;
  } else {
    contentUser = data.data.map((user, index) => {
      return (
        <Tbody height={10} bgColor="white" _hover={{ bg: "#EEEEEE" }}>
          <Tr key={index}>
            <Td textAlign={"center"}>{user.id}</Td>
            <Td textAlign={"center"}>{user.email}</Td>
            <Td textAlign={"center"}>{user.names[0]?.name}</Td>
            <Td textAlign={"center"}>{user.role}</Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <Box>
      <TableContainer mb={5} mt={0} ml={-4}>
        <Table border="solid 1px #EBEBEB" size="sm">
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th height={9} key={index} bg={"#009262"} textAlign={"center"} color="#FCFCFC" width={item.width}>
                    {item.name}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          {data ? (
            contentUser
          ) : (
            <Tbody>
              <Tr>
                {tableHead.map((item, index) => {
                  return (
                    <Td key={index}>
                      <Skeleton h={"10px"} />
                      <Skeleton h={"10px"} />
                      <Skeleton h={"10px"} />
                    </Td>
                  );
                })}
                <Td>
                  <Skeleton h={"10px"} />
                  <Skeleton h={"10px"} />
                  <Skeleton h={"10px"} />
                </Td>
              </Tr>
            </Tbody>
          )}
        </Table>
      </TableContainer>
      {/* Pagination */}
      {/* <Center paddingY={"10px"}>
        {pagination <= 0 ? (
          <IconButton icon={<SlArrowLeft />} disabled />
        ) : (
          <IconButton
            onClick={() => {
              setPagination(pagination - 1);
            }}
            icon={<SlArrowLeft />}
          />
        )}
        <Text paddingX={"10px"}>
          {pagination + 1} of {pages}
        </Text>
        {pagination < pages - 1 ? (
          <IconButton
            icon={<SlArrowRight />}
            onClick={() => {
              setPagination(pagination + 1);
            }}
          />
        ) : (
          <IconButton icon={<SlArrowRight />} disabled />
        )}
      </Center> */}
    </Box>
  );
}

export default UserList;
