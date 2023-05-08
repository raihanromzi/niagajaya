import React, { useState, useEffect } from "react";
import {
  useGetAllStockMutationQuery,
  usePutApproveStockMutationMutation,
  usePutCancelStockMutationMutation,
} from "../redux/store";
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

function StockMutationOnProgressList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("latest");
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const { data, isError, isLoading } = useGetAllStockMutationQuery({
    warehouseId: parseInt(id),
    user,
    page,
    limit,
    sort,
    statusMutation: "requested",
    search: searchParams.getAll("name"),
  });
  const [approveStockMutationMutation, { isLoading: loadingApprove, error }] =
    usePutApproveStockMutationMutation();

  const [cancelStockMutationMutation, { isLoading: loadingCancel }] =
    usePutCancelStockMutationMutation();

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data]);

  const clearSort = () => {
    setSort("");
  };

  const approveStockMutationWarning = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009262",
      confirmButtonText: "Ya Approve",
    }).then((result) => {
      if (result.isConfirmed) {
        approveStockMutationMutation({
          stockMutationId: data.stockMutationId,
          warehouseId: id,
          managerId: user.id,
        })
          .unwrap()
          .then(() => {
            Swal.fire(
              "Approved!",
              `Stock Mutation ID ${data.stockMutationId} has been approved`,
              "success",
            );
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.data.errors,
            });
          });
      }
    });
  };

  const cancelStockMutationWarning = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009262",
      confirmButtonText: "Ya Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelStockMutationMutation({
          stockMutationId: data.stockMutationId,
          warehouseId: id,
          managerId: user.id,
        })
          .unwrap()
          .then(() => {
            Swal.fire(
              "Approved!",
              `Stock Mutation ID ${data.stockMutationId} has been cancelled`,
              "success",
            );
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.data.errors,
            });
          });
      }
    });
  };

  const tableHead = [
    { name: "Stock Mutation ID", width: "10em" },
    { name: "Product", width: "10em" },
    { name: "Quantity", width: "10em" },
    { name: "Origin Warehouse", width: "10em" },
    { name: "Destination Warehouse", width: "10em" },
    { name: "Status", width: "10em" },
    { name: "Date", width: "10em" },
  ];

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
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
            <Td>
              <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
                <IconButton
                  onClick={() => {
                    approveStockMutationWarning(data);
                  }}
                  icon={<FaCheck />}
                  size="sm"
                />
                <IconButton
                  onClick={() => {
                    cancelStockMutationWarning(data);
                  }}
                  icon={<FaTimes />}
                  size="sm"
                  bg={"none"}
                  color={"#ff4d4d"}
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
              <Th
                bg={"#009262"}
                textAlign={"center"}
                color={"white"}
                width={"200px"}>
                Action
              </Th>
            </Tr>
          </Thead>
          {data ? (
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

export default StockMutationOnProgressList;
