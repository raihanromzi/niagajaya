import React, { useState, useEffect } from "react";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import PageProtected from "../../protected";
import { useSelector } from "react-redux";
import {
  SimpleGrid,
  Box,
  Text,
  Flex,
  Icon,
  Spinner,
  Center,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  RadioGroup,
  HStack,
  Radio,
  Button,
} from "@chakra-ui/react";
import WarehouseCard from "../../../components/WarehouseCard";
import { useGetAllWarehousesQuery } from "../../../redux/store";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

function WarehousesList() {
  const user = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("latest");
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: warehouses,
    isError,
    isLoading,
  } = useGetAllWarehousesQuery({
    page,
    limit,
    user,
    sort,
    search: searchParams.getAll("name"),
  });

  const clearSort = () => {
    setSort("");
  };

  useEffect(() => {
    setTotalPages(warehouses?.pagination?.total_page);
  }, [warehouses]);

  let contentWarehouses;
  if (isLoading) {
    contentWarehouses = <Spinner />;
  } else if (isError) {
    contentWarehouses = <div>Error loading Content.</div>;
  } else {
    contentWarehouses = (
      <SimpleGrid columns={[1, 2, 3]} spacing="40px">
        {warehouses.data.map((warehouse) => {
          return (
            <WarehouseCard
              key={warehouse.id}
              id={warehouse.id}
              name={warehouse.name || "No Name"}
              manager={warehouse.manager.names[0].name || "No Manager"}
              city={warehouse.city || "No City"}
              province={warehouse.province || "No Province"}
            />
          );
        })}
      </SimpleGrid>
    );
  }

  return (
    <PageProtected needLogin={true}>
      <AdminProductsLayout heading="Stock Management">
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
        <Box mt={5}>{contentWarehouses}</Box>
        {/* Pagination */}
        <Center paddingY={"100px"}>
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
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default WarehousesList;
