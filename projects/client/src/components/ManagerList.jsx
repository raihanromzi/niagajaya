import React, { useState, useEffect } from "react";
import { useGetAllManagerQuery } from "../redux/store";
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
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

function ManagerList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchParams, setSearchParams] = useSearchParams();

  const [totalPages, setTotalPages] = useState(1);
  const { data, isError, isLoading } = useGetAllManagerQuery({
    page,
    search: searchParams.getAll("name"),
  });

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data]);

  const tableHead = [
    {
      name: "Id",
      width: "5em",
    },
    {
      name: "Email",
      width: "60em",
    },
    {
      name: "Name",
      width: "40em",
    },
    {
      name: "Role",
      width: "20em",
    },
    {
      name: "Warehouse",
      width: "20em",
    },
  ];

  let contentManager;

  if (isLoading) {
    contentManager = <Spinner />;
  } else if (isError) {
    contentManager = <div>Error loading Content.</div>;
  } else {
    contentManager = data.data.map((manager, index) => {
      return (
        <Tbody
          key={index}
          height={10}
          bgColor="white"
          _hover={{
            bg: "#EEEEEE",
          }}>
          <Tr>
            <Td textAlign={"center"}>{manager.id}</Td>
            <Td textAlign={"center"}>{manager.email}</Td>
            <Td textAlign={"center"}>{manager.names[0]?.name}</Td>
            <Td textAlign={"center"}>{manager.role}</Td>
            <Td textAlign={"center"}>
              {manager.warehouse?.name || "Belum ada"}
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
            contentManager
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
          {page} of {totalPages ? totalPages : 1}
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

export default ManagerList;
