import React, { useState, useEffect } from "react";

import { useParams, useSearchParams } from "react-router-dom";
import PageProtected from "../routes/protected";
import {
  useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery,
  useDeleteStockProductMutation,
} from "../redux/store";
import {
  FaTrash,
  FaPen,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
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
} from "@chakra-ui/react";
import { EditStock } from "./EditStock";

function StockList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("latest");
  const { id } = useParams();
  const user = useSelector((state) => state.auth);

  const { data, isError, isLoading } =
    useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery({
      warehouseId: parseInt(id),
      user,
      page,
      limit,
      sort,
      search: searchParams.getAll("name"),
    });
  const [deleteStockProduct] = useDeleteStockProductMutation();

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data]);

  const clearSort = () => {
    setSort("");
  };

  const deleteWarning = async (productId) => {
    try {
      Swal.fire({
        title: "Are you sure want to Empty Stock?",
        text: "Stock will be empty!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#009262",
        confirmButtonText: "Ya Hapus",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteStockProduct({
            warehouseId: parseInt(id),
            productId: parseInt(productId),
          });
          Swal.fire("Deleted!", `Product stock has been empty.`, "success");
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
    { name: "Foto Produk", width: "10em" },
    { name: "Nama Produk", width: "40em" },
    { name: "Kategori", width: "30em" },
    { name: "Harga", width: "20em" },
    { name: "Stock", width: "10em" },
  ];

  let contentProduct;
  if (isLoading) {
    contentProduct = <Spinner />;
  } else if (isError) {
    contentProduct = <div>Error loading Stock.</div>;
  } else {
    contentProduct = data.data.map((data, index) => {
      return (
        <Tbody
          key={index}
          height={10}
          bgColor="white"
          _hover={{ bg: "#EEEEEE" }}>
          <Tr>
            <Td textAlign={"center"}>
              {data.product.imageURL ? (
                <img
                  src={data.product.imageURL}
                  alt={`Foto ${data.product.name}`}
                />
              ) : (
                <Icon
                  as={FaImage}
                  boxSize={10}
                  color="rgba(113, 113, 113, 0.5)"
                />
              )}
            </Td>
            <Td textAlign={"center"}>{data.product.name}</Td>
            <Td textAlign={"center"}>{data.product.category.name}</Td>
            <Td textAlign={"center"}>{data.product.priceRupiahPerUnit}</Td>
            <Td textAlign={"center"}>{data.quantity}</Td>
            <Td>
              <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
                <EditStock product={data} />
                <IconButton
                  onClick={() => {
                    deleteWarning(data.productId);
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
    <PageProtected needLogin={true}>
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
              contentProduct
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
    </PageProtected>
  );
}

export default StockList;
