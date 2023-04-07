import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { useParams, useSearchParams } from "react-router-dom";
import PageProtected from "../../protected";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import { useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery } from "../../../redux/store";
import {
  FaTrash,
  FaPen,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { RxCheck, RxCross1 } from "react-icons/rx";

import {
  Spinner,
  FormControl,
  FormLabel,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                <IconButton
                  icon={<FaPen />}
                  aria-label="edit stock"
                  size="sm"
                  onClick={onOpen}
                />
                <IconButton
                  // onClick={() => {
                  //   deleteWarning(admin);
                  // }}
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
      <AdminProductsLayout heading={"Manage Stock"}>
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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={"center"}>Add Admin</ModalHeader>
            <ModalBody>
              <AddForm close={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </AdminProductsLayout>
    </PageProtected>
  );
}

const AddForm = ({ close }) => {
  const validation = Yup.object().shape({
    email: Yup.string().email("Email Invalid").required("Cannot be Empty"),
    name: Yup.string().required("Cannot be Empty"),
    password: Yup.string().required("Cannot be Empty"),
  });

  const addAdmin = async (value) => {
    try {
      createAdmin(value)
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `New Admin Added`,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.data.errors,
          });
        });
      close();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data.errors,
      });
    }
  };

  return (
    <Box>
      <Formik
        initialValues={{
          email: "",
          name: "",
          password: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          addAdmin(value);
        }}>
        <Form>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input as={Field} type="email" name={"email"} />
            <ErrorMessage
              style={{ color: "red" }}
              component="div"
              name="email"
            />
            <FormLabel>Name</FormLabel>
            <Input as={Field} name={"name"} />
            <FormLabel>Password</FormLabel>
            <Input as={Field} name={"password"} />
            <ErrorMessage
              style={{ color: "red" }}
              component="div"
              name="name"
            />
            <Center paddingTop={"10px"} gap={"10px"}>
              <IconButton
                icon={<RxCheck />}
                fontSize={"3xl"}
                color={"green"}
                type={"submit"}
              />
              <IconButton
                icon={<RxCross1 />}
                fontSize={"xl"}
                color={"red"}
                onClick={close}
              />
            </Center>
          </FormControl>
        </Form>
      </Formik>
    </Box>
  );
};

export default StockDetail;
