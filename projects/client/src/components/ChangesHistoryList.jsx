import React, { useState, useEffect } from "react";
import { useGetAllStockHistoryQuery } from "../redux/store";
import { useParams } from "react-router-dom";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import {
  Flex,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Center,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Spinner,
  Tbody,
  Td,
  Skeleton,
  Icon,
  ModalFooter,
  Text,
  RadioGroup,
  Radio,
  HStack,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import {
  FaFileAlt,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

function ChangesHistoryList({ product, startDate, endDate }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("latest");
  const user = useSelector((state) => state.auth); // user id, user role

  const { id } = useParams(); // warehouse id

  const { data, isError, isLoading } = useGetAllStockHistoryQuery({
    warehouseId: parseInt(id),
    productId: product.productId,
    user,
    page,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    limit,
    sort,
  });

  useEffect(() => {
    setTotalPages(data?.pagination?.total_page);
  }, [data, startDate, endDate]);

  const clearSort = () => {
    setSort("");
  };

  const tableHead = [
    { name: "ID", width: "20%" },
    { name: "Product Image", width: "20%" },
    { name: "Product Name", width: "20%" },
    { name: "Warehouse", width: "20%" },
    { name: "Stock Before", width: "20%" },
    { name: "Stock After", width: "20%" },
    { name: "Status", width: "20%" },
    { name: "Type Name", width: "20%" },
    { name: "Updated at", width: "20%" },
  ];

  let contentProduct;
  if (isLoading) {
    contentProduct = <Spinner />;
  } else if (isError) {
    contentProduct = <div>Error loading Stock.</div>;
  } else {
    data.data.changes.length > 0
      ? (contentProduct = data.data.changes.map((data, index) => {
          return (
            <Tbody key={index} bgColor="white" _hover={{ bg: "#EEEEEE" }}>
              <Tr>
                <Td textAlign={"center"}>{data.id}</Td>
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
                <Td textAlign={"center"}>{data.warehouseName}</Td>
                <Td textAlign={"center"}>{data.stockBefore}</Td>
                <Td textAlign={"center"}>{data.stockAfter}</Td>
                <Td textAlign={"center"}>{data.type}</Td>
                <Td textAlign={"center"}>{data.typeName}</Td>
                <Td textAlign={"center"}>{data.createdAt.split("T")[0]}</Td>
              </Tr>
            </Tbody>
          );
        }))
      : (contentProduct = (
          <Tbody>
            <Tr>
              {tableHead.map((item, index) => {
                return (
                  <Td key={index}>
                    <Skeleton h={"10px"} />
                  </Td>
                );
              })}
            </Tr>
          </Tbody>
        ));
  }

  return (
    <Box>
      <IconButton
        icon={<FaFileAlt />}
        aria-label="edit stock product"
        size="sm"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stock History of {product.productName}</ModalHeader>
          <ModalBody>
            {/* Nanti isinya produk, nama, warehouse, stock in, stock out, type,
            stock akhir */}
            <TableContainer>
              <Flex justifyContent={"flex-end"} mb={8}>
                <InputGroup size="sm">
                  <RadioGroup value={sort}>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      height="100%">
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
              </Flex>
              <Table size={"sm"}>
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
            <Center mt={8} paddingY={"10px"}>
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
          </ModalBody>
          <ModalFooter>
            <Button
              color={"white"}
              colorScheme="green"
              mr={3}
              onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ChangesHistoryList;
