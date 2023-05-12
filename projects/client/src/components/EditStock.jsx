import { useUpdateStockProductMutation } from "../redux/store";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

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
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { FaPen } from "react-icons/fa";

export const EditStock = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton
        icon={<FaPen />}
        aria-label="edit stock product"
        size="sm"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit Stock</ModalHeader>
          <ModalBody>
            <EditForm product={product} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, product }) => {
  const [updateStockProduct, { isLoading, error }] =
    useUpdateStockProductMutation();
  const { id } = useParams();

  const validation = Yup.object().shape({
    quantity: Yup.number().required("Cannot be Empty"),
  });

  if (isLoading) {
    Swal.showLoading();
  }

  const editStock = async (value) => {
    try {
      updateStockProduct({
        productId: product.productId,
        warehouseId: id,
        quantity: value.quantity,
      })
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Stock Edited`,
            confirmButtonColor: "#009262",
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
          quantity: product.quantity,
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          value.quantity !== product.quantity ? editStock(value) : close();
        }}>
        {(props) => {
          return (
            <Form>
              <FormControl>
                <Flex justifyContent={"flex-start"} flexDir="column" gap={2}>
                  <FormLabel>Quantity</FormLabel>
                  <Input as={Field} type="number" name={"quantity"} />
                  <ErrorMessage
                    style={{ color: "red" }}
                    component="div"
                    name="quantity"
                  />
                </Flex>
                <ErrorMessage
                  style={{ color: "red" }}
                  component="div"
                  name="name"
                />
                <Center paddingTop={"10px"} gap={"10px"} mt={10}>
                  <Button type="submit" bgColor="#009262" color="white">
                    Simpan Perubahan
                  </Button>
                  <Button
                    variant="outline"
                    color="#009262"
                    borderColor="#009262"
                    mr={5}
                    onClick={close}>
                    Batal
                  </Button>
                </Center>
              </FormControl>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
