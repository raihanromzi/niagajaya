import React, { useState } from "react";

import { useParams, useSearchParams } from "react-router-dom";
import PageProtected from "../../protected";

import {
  FaTrash,
  FaPen,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
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
  useDisclosure,
} from "@chakra-ui/react";
import { EditStock } from "./EditStock";

function StockHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const { id } = useParams(); // warehouse id
  const user = useSelector((state) => state.auth);

  const tableHead = [
    { name: "Foto Produk", width: "10em" },
    { name: "Nama Produk", width: "40em" },
    { name: "Kategori", width: "30em" },
    { name: "Harga", width: "20em" },
    { name: "Stock", width: "10em" },
  ];

  return (
    <PageProtected needLogin={true}>
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
    </PageProtected>
  );
}

export default StockHistory;
