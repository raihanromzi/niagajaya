import { Formik, ErrorMessage, Form, Field } from "formik";
import { useState } from "react";

import * as Yup from "yup";
import {
  usePostNewStockMutationMutation,
  useGetAllImporterWarehouseQuery,
  useGetAllImporterWarehouseStockQuery,
  useGetWarehouseByIdQuery,
} from "../redux/store";
import {
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
  Select,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { RxCheck, RxCross1 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";

export const AddStockMutation = ({ warehouseId, managerId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onOpen}
        to="add"
        leftIcon={<FaPlus />}
        fontSize="sm"
        ml={2}
        size="sm">
        Stock Mutation
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Create Stock Mutation</ModalHeader>
          <ModalBody>
            <AddForm
              close={onClose}
              warehouseId={warehouseId}
              managerId={managerId}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close, warehouseId, managerId }) => {
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [createStockMutation, { isLoading, error }] =
    usePostNewStockMutationMutation();

  const {
    data: warehouses,
    isLoading: isLoadingWarehouses,
    isError: isErrorWarehouses,
  } = useGetAllImporterWarehouseQuery({
    warehouseId,
  });
  const {
    data: stocks,
    isLoading: isLoadingStocks,
    isError: isErrorStocks,
  } = useGetAllImporterWarehouseStockQuery({ warehouseId });
  const {
    data: currWarehouse,
    isLoading: isLoadingCurrWarehouse,
    isError: isErrorCurrWarehouse,
  } = useGetWarehouseByIdQuery({ warehouseId });

  const handleProductChange = (event, setFieldValue) => {
    const selectedStock = stocks.data.find((stock) => {
      return parseInt(stock.productId) === parseInt(event.target.value);
    });
    if (selectedStock) {
      setMaxQuantity(selectedStock.quantity);
    } else {
      setMaxQuantity(0);
    }
    setFieldValue("product", event.target.value);
  };

  const validation = Yup.object().shape({
    quantity: Yup.number()
      .required("Cannot be Empty")
      .positive()
      .integer()
      .max(maxQuantity, `Max Quantity is ${maxQuantity}`),
  });

  if (isLoading) {
    Swal.showLoading();
  }

  const addMutation = async (value) => {
    try {
      createStockMutation({
        exporterId: value.exporter_gudang_asal,
        importerId: value.importer_gudang_tujuan,
        productId: parseInt(value.product),
        quantity: value.quantity,
        managerId,
      })
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `New Stock Mutation Added`,
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
          exporter_gudang_asal: warehouseId,
          importer_gudang_tujuan: "",
          product: "",
          quantity: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          console.log(value);
          addMutation(value);
        }}>
        {({ setFieldValue }) => (
          <Form>
            <FormControl>
              <FormLabel>Exporter</FormLabel>
              <Field as="select" name="exporter_gudang_asal">
                {isLoadingCurrWarehouse ? (
                  <option>Loading...</option>
                ) : (
                  <option
                    key={currWarehouse.data.id}
                    value={currWarehouse.data.id}>
                    {currWarehouse.data.name}
                  </option>
                )}
              </Field>
              <ErrorMessage
                style={{ color: "red" }}
                component="div"
                name="exporter"
              />
              <FormLabel>Importer</FormLabel>
              <Field as="select" name="importer_gudang_tujuan">
                <option value="">Select Importer Warehouse</option>
                {isLoadingWarehouses ? (
                  <option>Loading...</option>
                ) : (
                  warehouses.data.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))
                )}
              </Field>
              <ErrorMessage
                style={{ color: "red" }}
                component="div"
                name="importer"
              />
              <FormLabel>Product</FormLabel>
              <Field
                as="select"
                name="product"
                onChange={(event) => handleProductChange(event, setFieldValue)}>
                <option value="">Select a product</option>
                {isLoadingStocks ? (
                  <option>Loading...</option>
                ) : (
                  stocks.data.map(
                    (stock) =>
                      stock.quantity > 0 && (
                        <option key={stock.productId} value={stock.productId}>
                          {stock.productName}
                        </option>
                      ),
                  )
                )}
              </Field>
              <ErrorMessage
                style={{ color: "red" }}
                component="div"
                name="product"
              />
              <FormLabel>Quantity</FormLabel>
              <Input
                as={Field}
                type="number"
                name={"quantity"}
                max={maxQuantity}
              />
              <ErrorMessage
                style={{ color: "red" }}
                component="div"
                name="quantity"
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
        )}
      </Formik>
    </Box>
  );
};
