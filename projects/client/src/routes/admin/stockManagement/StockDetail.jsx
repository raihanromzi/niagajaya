import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PageProtected from "../../protected";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import { useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery } from "../../../redux/store";
import {
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
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
} from "@chakra-ui/react";

function StockDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const { id } = useParams();
  const { data, isError, isLoading } =
    useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery({
      warehouseId: parseInt(id),
    });
  console.log("====================================");
  console.log(data);
  console.log("====================================");

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
    contentProduct = <div>Error loading albums.</div>;
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
              {
                <img
                  src={
                    data.product.imageURL
                      ? data.product.imageURL
                      : "http://cdn.shopify.com/s/files/1/0451/1101/7626/products/carrotseeds.jpg?v=1604032858"
                  }
                  alt={`Foto ${data.product.name}`}
                />
              }
            </Td>
            <Td textAlign={"center"}>{data.product.name}</Td>
            <Td textAlign={"center"}>{data.product.category.name}</Td>
            <Td textAlign={"center"}>{data.product.priceRupiahPerUnit}</Td>
            <Td textAlign={"center"}>{data.quantity}</Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <PageProtected needLogin={true}>
      <AdminProductsLayout heading={`Warehouse with id ${id}`}>
        <h1>Warehouse with id {id}</h1>
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
          </Center> */}
        </Box>
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default StockDetail;
