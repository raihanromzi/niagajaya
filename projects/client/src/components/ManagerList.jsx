import React from "react";
import { useGetAllManagerQuery } from "../redux/store";
import { Spinner, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex, Box, Center, Input, InputGroup, InputRightElement, IconButton, Skeleton, Stack, Text } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { BsFillTrashFill } from "react-icons/bs";

function ManagerList() {
  const { data, isError, isLoading } = useGetAllManagerQuery();

  // const [pagination, setPagination] = useState(0);
  // const [pages, setPages] = useState("");

  const tableHead = [
    { name: "Id", origin: "id", width: "5em" },
    { name: "Email", origin: "email", width: "60em" },
    { name: "Name", origin: "name", width: "40em" },
    { name: "Role", origin: "role", width: "20em" },
  ];

  let contentManager;

  if (isLoading) {
    contentManager = <Spinner />;
  } else if (isError) {
    contentManager = <div>Error loading albums.</div>;
  } else {
    contentManager = data.data.map((manager, index) => {
      return (
        <Tbody key={index} bg={"#EEEEEE"} _hover={{ bg: "#d6d6d6" }}>
          <Tr>
            <Td textAlign={"center"}>{manager.id}</Td>
            <Td textAlign={"center"}>{manager.email}</Td>
            <Td textAlign={"center"}>{manager.names[0]?.name}</Td>
            <Td textAlign={"center"}>{manager.role}</Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <Box>
      <TableContainer borderRadius={"4px"}>
        <Table>
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th key={index} bg={"#00ADB5"} textAlign={"center"} color={"white"} width={item.width} borderY={"none"}>
                    <Center>
                      <Flex gap={"5px"}>
                        <Center>{item.name}</Center>
                      </Flex>
                    </Center>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          {data ? (
            contentManager
          ) : (
            <Tbody>
              <Tr>
                {tableHead.map((item, index) => {
                  return (
                    <Td key={index}>
                      <Skeleton h={"10px"} />
                    </Td>
                  );
                })}
                <Td>
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

export default ManagerList;
