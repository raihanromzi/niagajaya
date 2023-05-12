import React from "react";
import PageProtected from "../protected";
import AdminProductsLayout from "../../components/AdminProductsLayout";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { useGetAllSalesReportByWarehouseQuery } from "../../redux/store";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaTrash,
  FaPen,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import DatePicker from "react-datepicker";

function SalesReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState(null);
  const [allProductsCategory, setallProductsCategory] = useState([]);
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.auth);

  const { data, isError, isLoading } = useGetAllSalesReportByWarehouseQuery({
    warehouseId: parseInt(id),
    user,
    page,
    limit,
    sort,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    search: searchParams.getAll("name"),
    category,
  });

  const clearSort = () => {
    setSort("");
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data, startDate, endDate, category]);

  useEffect(() => {
    if (data) {
      const productCategories = [...data.data];
      setallProductsCategory(productCategories);
    }
  }, []);

  const categories = useMemo(() => {
    if (!data) {
      return [];
    }

    const uniqueCategories = new Set(
      allProductsCategory.map((item) => item.productCategory),
    );
    return Array.from(uniqueCategories);
  }, [data]);

  const tableHead = [
    { name: "Order ID", width: "10em" },
    { name: "Foto Produk", width: "10em" },
    { name: "Nama Produk", width: "10em" },
    { name: "Kategori", width: "10em" },
    { name: "Nama User", width: "10em" },
    { name: "Status", width: "10em" },
    { name: "Kuantitas", width: "10em" },
    { name: "Harga", width: "10em" },
    { name: "Total Order", width: "10em" },
    { name: "Waktu Order", width: "10em" },
  ];

  let contentProduct;
  let optionProductCategory;
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
            <Td textAlign={"center"}>{data.orderId}</Td>
            <Td textAlign={"center"}>
              {data.productImageUrl.includes("NULL") ? (
                <Icon
                  as={FaImage}
                  boxSize={10}
                  color="rgba(113, 113, 113, 0.5)"
                />
              ) : (
                <img
                  src={data.productImageUrl}
                  alt={`Foto ${data.productName}`}
                />
              )}
            </Td>
            <Td textAlign={"center"}>{data.productName}</Td>
            <Td textAlign={"center"}>{data.productCategory}</Td>
            <Td textAlign={"center"}>{data.userName}</Td>
            <Td textAlign={"center"}>{data.status}</Td>
            <Td textAlign={"center"}>{data.quantity}</Td>
            <Td textAlign={"center"}>{data.pricePerUnit}</Td>
            <Td textAlign={"center"}>{data.totalPrice}</Td>
            <Td textAlign={"center"}>{data.orderedAt.split("T")[0]}</Td>
          </Tr>
        </Tbody>
      );
    });
  }

  return (
    <PageProtected needLogin={true}>
      <AdminProductsLayout heading="Sales Report">
        <Box>
          <TableContainer mb={5}>
            <Flex justifyContent={"space-between"} mb={4} gap={2}>
              <Flex>
                <Select
                  size="sm"
                  placeholder="Select product category"
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Flex>

              <Flex
                justifyContent="center"
                alignItems="center"
                height="100%"
                gap={2}>
                <InputGroup size="sm">
                  <Input
                    as={DatePicker}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start date"
                    borderWidth={1}
                    borderColor="gray.400"
                    dateFormat="yyyy-MM-dd"
                  />
                </InputGroup>
                <InputGroup size="sm">
                  <Input
                    as={DatePicker}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End date"
                    borderWidth={1}
                    borderColor="gray.400"
                    dateFormat="yyyy-MM-dd"
                  />
                </InputGroup>
                <IconButton
                  icon={<FaTimes />}
                  size="sm"
                  onClick={clearDateRange}
                />
              </Flex>

              <Flex justifyContent="center" alignItems="center" height="100%">
                <InputGroup size="sm">
                  <RadioGroup value={sort}>
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
                  </RadioGroup>
                </InputGroup>
              </Flex>

              <Flex>
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
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default SalesReport;
