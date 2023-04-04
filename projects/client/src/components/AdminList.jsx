import React, { useState, useEffect } from "react";
import { useGetAllAdminQuery, useDeleteAdminMutation } from "../redux/store";
import { Spinner, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex, Box, Center, Input, InputGroup, InputRightElement, IconButton, Skeleton, Stack, Text } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { EditAdmin } from "./EditAdmin";
import { AddAdmin } from "./AddAdmin";

function AdminList() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { data, isError, isLoading } = useGetAllAdminQuery(page);
  const [deleteAdmin] = useDeleteAdminMutation();

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data]);

  const deleteWarning = async (admin) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#009262",
        confirmButtonText: "Ya Hapus",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAdmin(admin.id);
          Swal.fire("Deleted!", `${admin.names[0].name} has been deleted`, "success");
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
    { name: "Id", width: "5em" },
    { name: "Email", width: "60em" },
    { name: "Name", width: "40em" },
    { name: "Role", width: "20em" },
  ];

  let contentAdmin;

  if (isLoading) {
    contentAdmin = <Spinner />;
  } else if (isError) {
    contentAdmin = <div>Error loading albums.</div>;
  } else {
    contentAdmin = data.data.map((admin, index) => {
      return (
        <Tbody key={index} height={10} bgColor="white" _hover={{ bg: "#EEEEEE" }}>
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
                    deleteWarning(admin);
                  }}
                  bg={"none"}
                  color={"#ff4d4d"}
                  icon={<FaTrash />}
                  size="sm"
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
      <TableContainer mb={5} mt={-12} ml={-4}>
        <Flex justifyContent={"flex-end"} mb={4}>
          <AddAdmin />
        </Flex>
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
              <Th bg={"#009262"} textAlign={"center"} color={"white"} width={"200px"}>
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
      <Center paddingY={"10px"}>
        {page <= 1 ? (
          <IconButton icon={<FaChevronLeft />} disabled />
        ) : (
          <IconButton
            onClick={() => {
              setPage(page - 1);
            }}
            icon={<FaChevronLeft />}
          />
        )}
        <Text paddingX={"10px"}>
          {page} of {totalPages}
        </Text>
        {page < totalPages ? (
          <IconButton
            icon={<FaChevronRight />}
            onClick={() => {
              setPage(page + 1);
            }}
          />
        ) : (
          <IconButton icon={<FaChevronRight />} disabled />
        )}
      </Center>
    </Box>
  );
}

export default AdminList;
