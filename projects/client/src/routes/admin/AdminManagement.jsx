import React from "react";
import { useGetAllAdminQuery, useGetAllManagerQuery, useGetAllUserQuery, useCrateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } from "../../redux/store";
import { Heading, Spinner, Flex, Table, Thead, Tbody, Tr, Th, TableContainer, Td } from "@chakra-ui/react";

function AdminManagement() {
  const { data: admins, error: isAdminErors, isLoading: isAdminLoading } = useGetAllAdminQuery();
  const { data: managers, error: isManagerErors, isLoading: isManagerLoading } = useGetAllManagerQuery();
  const { data: users, error: isUsersErors, isLoading: isUsersLoading } = useGetAllUserQuery();
  console.log(admins);

  let contentAdmin;
  let contentManager;
  let contentUsers;

  if (isAdminLoading) {
    contentAdmin = <Spinner />;
  } else if (isAdminErors) {
    contentAdmin = <div>Error loading albums.</div>;
  } else {
    contentAdmin = admins.data.map((admin, index) => {
      return (
        <Tr key={index}>
          <Td>{admin.names[0].name}</Td>
          <Td>{admin.email}</Td>
        </Tr>
      );
    });
  }

  if (isManagerLoading) {
    contentManager = <Spinner />;
  } else if (isManagerErors) {
    contentManager = <div>Error loading albums.</div>;
  } else {
    contentManager = managers.data.map((manager, index) => {
      return (
        <Tr key={index}>
          <Td>Belum</Td>
          <Td>{manager.names}</Td>
          <Td>{manager.email}</Td>
        </Tr>
      );
    });
  }

  if (isUsersLoading) {
    contentUsers = <Spinner />;
  } else if (isUsersErors) {
    contentUsers = <div>Error loading albums.</div>;
  } else {
    contentUsers = users.data.map((user, index) => {
      return (
        <Tr key={index}>
          <Td>Belum</Td>
          <Td>{user.names}</Td>
          <Td>{user.email}</Td>
        </Tr>
      );
    });
  }

  return (
    <Flex flexDirection={"column"}>
      <Heading>Admin</Heading>
      <TableContainer>
        <Table size={"md"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>{contentAdmin}</Tbody>
        </Table>
      </TableContainer>

      <Heading>Manager</Heading>
      <TableContainer>
        <Table size={"md"}>
          <Thead>
            <Tr>
              <Th>Store Name</Th>
              <Th>Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>{contentManager}</Tbody>
        </Table>
      </TableContainer>

      <Heading>User</Heading>
      <TableContainer>
        <Table size={"md"}>
          <Thead>
            <Tr>
              <Th>Store Name</Th>
              <Th>Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>{contentUsers}</Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default AdminManagement;
