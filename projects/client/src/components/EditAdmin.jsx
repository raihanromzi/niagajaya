import { useUpdateAdminMutation } from "../redux/store";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
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

export const EditAdmin = ({ admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton
        icon={<FaPen />}
        aria-label="edit product category"
        size="sm"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit Admin</ModalHeader>
          <ModalBody>
            <EditForm admin={admin} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, admin }) => {
  const [updateAdmin, { isLoading, error }] = useUpdateAdminMutation();

  const validation = Yup.object().shape({
    email: Yup.string().email("Email Invalid").required("Cannot be Empty"),
    newName: Yup.string().required("Cannot be Empty"),
  });

  if (isLoading) {
    Swal.showLoading();
  }

  const editUser = async (value) => {
    try {
      updateAdmin(value)
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Admin Edited`,
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
          email: admin.email,
          name: admin.names[0].name,
          newName: "",
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          value.id = admin.id;
          value.name = admin.names[0].name;
          editUser(value);
        }}>
        {(props) => {
          return (
            <Form>
              <FormControl>
                <Flex justifyContent={"flex-start"} flexDir="column" gap={2}>
                  <FormLabel>Email</FormLabel>
                  <Input as={Field} type="email" name={"email"} />
                  <ErrorMessage
                    style={{ color: "red" }}
                    component="div"
                    name="email"
                  />
                  <FormLabel>Name</FormLabel>
                  <Input disabled as={Field} name={"name"} />
                  <ErrorMessage
                    style={{ color: "red" }}
                    component="div"
                    name="name"
                  />
                  <FormLabel>New Name</FormLabel>
                  <Input as={Field} name={"newName"} />
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
