import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Form, Link as RouterLink, useActionData } from "react-router-dom";
import ecoBagImg from "../assets/Eco bag with food.png";
import FormElem from "../components/FormElem";
import StyledInput from "../components/StyledInput";

/** @type {import("react-router-dom").ActionFunction} */
export const registerAction = async ({ request }) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/auth/register",
      Object.fromEntries(await request.formData()),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

const RegisterPage = () => {
  const actionData = useActionData();

  return (
    <Flex
      mx="auto"
      my={10}
      maxW="5xl"
      boxShadow={{ lg: "0 8px 16px rgba(171, 190, 209, 0.4)" }}
      borderRadius="10px"
      justifyContent="space-evenly"
      flexDir={{ base: "column-reverse", lg: "row" }}
    >
      <Center>
        <Image src={ecoBagImg} alt="eco bag with food" />
      </Center>
      {!actionData?.success ? (
        <Center py={10} flexDir="column">
          <Heading fontSize="3xl" mb={5}>
            Pendaftaran
          </Heading>
          <Box border="solid #EBEBEB 1px" borderRadius="10px" p={5} w={96}>
            <VStack as={Form} method="post" spacing={5}>
              <FormElem
                error={actionData?.errors?.email}
                helperText="Surel verifikasi akan terkirim ke alamat"
              >
                <StyledInput
                  type="email"
                  name="email"
                  placeholder="Alamat Surel"
                />
              </FormElem>
              <FormElem
                error={actionData?.errors?.name}
                helperText="Nama akan tertampil secara umum"
              >
                <StyledInput
                  name="name"
                  placeholder="Nama Pengguna"
                  maxLength={255}
                  pattern="^[a-zA-Z\s]+$"
                />
              </FormElem>
              <Text fontSize="x-small" px={5} textAlign="center">
                Dengan mendaftar, Saya menyetujui&#32;
                <Link as={RouterLink} to="#" color="#009262">
                  Syarat dan Ketentuan
                </Link>
                &#32;serta&#32;
                <Link as={RouterLink} to="#" color="#009262">
                  Kebijakan Privasi
                </Link>
              </Text>
              <Button type="submit" bgColor="#009262" color="#FCFCFC" w="full">
                Buat Akun
              </Button>
              <Divider />
            </VStack>
          </Box>
        </Center>
      ) : (
        <Center textAlign="center" py={10} flexDir="column">
          <Box>
            <Heading>Pendaftaran berhasil!</Heading>
            <Text>Mohon periksa surel untuk verifikasi akun</Text>
          </Box>
        </Center>
      )}
    </Flex>
  );
};

export default RegisterPage;
