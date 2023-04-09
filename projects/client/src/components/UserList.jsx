import React, { useState, useEffect } from "react";
import { useGetAllUserQuery } from "../redux/store";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

import {
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Center,
  IconButton,
  Skeleton,
  Text,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
} from "@chakra-ui/react";

function UserList() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(5);

  const { data, isError, isLoading } = useGetAllUserQuery({
    page,
    limit,
    search: searchParams.getAll("name"),
  });

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data]);

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
        <Tbody
          key={index}
          height={10}
          bgColor="white"
          _hover={{ bg: "#EEEEEE" }}>
          <Tr>
            <Td textAlign="center">{user.id}</Td>
            <Td textAlign="center">{user.email}</Td>
            <Td textAlign="center">{user.names[0]?.name}</Td>
            <Td textAlign="center">{user.role}</Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <Box>
      <TableContainer mb={5}>
        <Flex justifyContent={"flex-end"} mb={4}>
          <InputGroup w={48} size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} />
            </InputLeftElement>
            <Input
              placeholder="Cari"
              onBlur={(e) => {
                setSearchParams((val) => {
                  val.set("name", e.target.value);
                  return val;
                });
              }}
            />
          </InputGroup>
        </Flex>
        <Table border="solid 1px #EBEBEB" size="sm">
          <Thead>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Th
                    height={9}
                    key={index}
                    bg={"#009262"}
                    textAlign={"center"}
                    color="#FCFCFC"
                    width={item.width}>
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
          {page} of {totalPages ? totalPages : 0}
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

export default UserList;
