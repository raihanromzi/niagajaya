import React, { useState, useEffect } from "react";

import { useParams, useSearchParams } from "react-router-dom";
import PageProtected from "../../protected";
import {
  useGetAllStockHistoryQuery,
  useGetStockSummaryQuery,
} from "../../../redux/store";

import {
  FaTrash,
  FaPen,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaSearch,
  FaRegTrashAlt,
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
  Button,
} from "@chakra-ui/react";
import ChangesHistoryList from "../../../components/ChangesHistoryList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function StockHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("latest");
  const [productId, setProductId] = useState(1); // default product id
  const { id } = useParams(); // warehouse id
  const user = useSelector((state) => state.auth); // user id, user role
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { data, isError, isLoading } = useGetStockSummaryQuery({
    warehouseId: parseInt(id),
    user,
    page,
    limit,
    sort,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    search: searchParams.getAll("name"),
  });

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data, startDate, endDate]);

  const clearSort = () => {
    setSort("");
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const tableHead = [
    { name: "Foto Produk", width: "10em" },
    { name: "Nama Produk", width: "40em" },
    { name: "Total Out", width: "20em" },
    { name: "Total In", width: "20em" },
    { name: "Last Stock", width: "20em" },
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
              {data.imageUrl.includes("NULL") ? (
                <Icon
                  as={FaImage}
                  boxSize={10}
                  color="rgba(113, 113, 113, 0.5)"
                />
              ) : (
                <img src={data.imageUrl} alt={`Foto ${data.productName}`} />
              )}
            </Td>
            <Td textAlign={"center"}>{data.productName}</Td>
            <Td textAlign={"center"}>{data.total_out}</Td>
            <Td textAlign={"center"}>{data.total_in}</Td>
            <Td textAlign={"center"}>{data.last_stock}</Td>
            <Td>
              <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
                <ChangesHistoryList
                  product={data}
                  startDate={startDate}
                  endDate={endDate}
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
          <Flex justifyContent={"space-between"} mb={4} gap={2}>
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

export default StockHistory;
