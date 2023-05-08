import React, { useState, useEffect } from "react";
import { useGetAllStockMutationQuery } from "../redux/store";
import {
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
  Center,
  IconButton,
  Skeleton,
  Text,
  InputLeftElement,
  Input,
  InputGroup,
  Icon,
  RadioGroup,
  HStack,
  Radio,
  Button,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

function StockMutationCancelled() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("latest");
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAllStockMutationQuery({
    warehouseId: parseInt(id),
    user,
    page,
    limit,
    sort,
    statusMutation: "cancelled",
    search: searchParams.getAll("name"),
  });

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data]);

  const clearSort = () => {
    setSort("");
  };

  const tableHead = [
    { name: "Stock Mutation ID", width: "20em" },
    { name: "Product", width: "20em" },
    { name: "Quantity", width: "20em" },
    { name: "Origin Warehouse", width: "20em" },
    { name: "Destination Warehouse", width: "20em" },
    { name: "Status", width: "20em" },
    { name: "Date", width: "20em" },
  ];

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <div>Error loading Stock Mutation.</div>;
  } else {
    content = data.data.map((data, index) => {
      return (
        <Tbody
          key={index}
          height={10}
          bgColor="white"
          _hover={{ bg: "#EEEEEE" }}>
          <Tr>
            <Td textAlign={"center"}>{data.stockMutationId}</Td>
            <Td textAlign={"center"}>{data.productName}</Td>
            <Td textAlign={"center"}>{data.quantity}</Td>
            <Td textAlign={"center"}>{data.originWarehouseName}</Td>
            <Td textAlign={"center"}>{data.destinationWarehouseName}</Td>
            <Td textAlign={"center"}>{data.status}</Td>
            <Td textAlign={"center"}>{data.createdAt.split("T")[0]}</Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <Box>
      <TableContainer mb={5}>
        <Flex justifyContent={"flex-end"} mb={4}>
          <InputGroup size="sm">
            <RadioGroup value={sort}>
              <Flex justifyContent="center" alignItems="center" height="100%">
                <HStack spacing="24px">
                  <Radio value="oldest" onClick={() => setSort("oldest")}>
                    Oldest
                  </Radio>
                  <Radio value="latest" onClick={() => setSort("latest")}>
                    Latest
                  </Radio>
                  <IconButton
                    icon={<FaTimes />}
                    size="sm"
                    onClick={clearSort}
                  />
                </HStack>
              </Flex>
            </RadioGroup>
          </InputGroup>
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
          {content ? (
            content
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
          {page} of {totalPages || 1}
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

export default StockMutationCancelled;
