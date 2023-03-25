import React from "react";
import { useGetAllAdminQuery, useDeleteAdminMutation } from "../redux/store";
import { Spinner, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex, Box, Center, Input, InputGroup, InputRightElement, IconButton, Skeleton, Stack, Text } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { BsFillTrashFill } from "react-icons/bs";
import { EditAdmin } from "./EditAdmin";
import { AddAdmin } from "./AddAdmin";

function AdminList() {
  const { data, isError, isLoading } = useGetAllAdminQuery();
  const [deleteAdmin] = useDeleteAdminMutation();

  // const [pagination, setPagination] = useState(0);
  // const [pages, setPages] = useState("");

  const deleteWarning = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAdmin(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.data.errors,
      });
    }
  };

  const tableHead = [
    { name: "Id", origin: "id", width: "5em" },
    { name: "Email", origin: "email", width: "60em" },
    { name: "Name", origin: "name", width: "40em" },
    { name: "Role", origin: "role", width: "20em" },
  ];

  let contentAdmin;

  if (isLoading) {
    contentAdmin = <Spinner />;
  } else if (isError) {
    contentAdmin = <div>Error loading albums.</div>;
  } else {
    contentAdmin = data.data.map((admin, index) => {
      return (
        <Tbody key={index} bg={"#EEEEEE"} _hover={{ bg: "#d6d6d6" }}>
          <Tr>
            <Td textAlign={"center"}>{admin.id}</Td>
            <Td textAlign={"center"}>{admin.email}</Td>
            <Td textAlign={"center"}>{admin.names[0].name}</Td>
            <Td textAlign={"center"}>{admin.role}</Td>
            <Td>
              <Flex gap={"20px"} justifyContent={"center"} alignItems={"center"}>
                <EditAdmin admin={admin} />
                <IconButton
                  onClick={() => {
                    deleteWarning(admin.id);
                  }}
                  bg={"none"}
                  color={"#ff4d4d"}
                  icon={<BsFillTrashFill />}
                />
              </Flex>
            </Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <Box>
      <Flex justifyContent={"flex-end"} mb={4}>
        <AddAdmin />
      </Flex>
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
              <Th bg={"#00ADB5"} textAlign={"center"} color={"white"} width={"200px"} borderY={"none"}>
                Action
              </Th>
            </Tr>
          </Thead>
          {data ? (
            contentAdmin
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

export default AdminList;
