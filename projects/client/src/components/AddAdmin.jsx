import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import { useCrateAdminMutation } from "../redux/store";
import { Button, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, FormControl, FormLabel, Input, IconButton, Center } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { GrAdd } from "react-icons/gr";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const AddAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button leftIcon={<GrAdd />} colorScheme="teal" variant="outline" onClick={onOpen}>
        Add Admin
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add Admin</ModalHeader>
          <ModalBody>
            <AddForm close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const AddForm = ({ close }) => {
  const [createAdmin, { isLoading, error }] = useCrateAdminMutation();

  const validation = Yup.object().shape({
    email: Yup.string().email("Email Invalid").required("Cannot be Empty"),
    name: Yup.string().required("Cannot be Empty"),
    password: Yup.string().required("Cannot be Empty"),
  });

  if (isLoading) {
    Swal.showLoading();
  }

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
        }}
      >
        <Form>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input as={Field} type="email" name={"email"} />
            <ErrorMessage style={{ color: "red" }} component="div" name="email" />
            <FormLabel>Name</FormLabel>
            <Input as={Field} name={"name"} />
            <FormLabel>Password</FormLabel>
            <Input as={Field} name={"password"} />
            <ErrorMessage style={{ color: "red" }} component="div" name="name" />
            <Center paddingTop={"10px"} gap={"10px"}>
              <IconButton icon={<RxCheck />} fontSize={"3xl"} color={"green"} type={"submit"} />
              <IconButton icon={<RxCross1 />} fontSize={"xl"} color={"red"} onClick={close} />
            </Center>
          </FormControl>
        </Form>
      </Formik>
    </Box>
  );
};
