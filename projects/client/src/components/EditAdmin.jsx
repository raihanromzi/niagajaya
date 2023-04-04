import { useUpdateAdminMutation } from "../redux/store";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, FormControl, FormLabel, Input, IconButton, Center } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { RxCheck, RxCross1 } from "react-icons/rx";
import { FaPen } from "react-icons/fa";

export const EditAdmin = ({ admin, getUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton icon={<FaPen />} aria-label="edit product category" size="sm" onClick={onOpen} />
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
          console.log(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input as={Field} type="email" name={"email"} />
                <ErrorMessage style={{ color: "red" }} component="div" name="email" />
                <FormLabel>Name</FormLabel>
                <Input disabled as={Field} name={"name"} />
                <ErrorMessage style={{ color: "red" }} component="div" name="name" />
                <FormLabel>New Name</FormLabel>
                <Input as={Field} name={"newName"} />
                <ErrorMessage style={{ color: "red" }} component="div" name="name" />
                <Center paddingTop={"10px"} gap={"10px"}>
                  <IconButton icon={<RxCheck />} fontSize={"3xl"} color={"green"} type={"submit"} />
                  <IconButton icon={<RxCross1 />} fontSize={"xl"} color={"red"} onClick={close} />
                </Center>
              </FormControl>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
