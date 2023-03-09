import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Form, Link as RouterLink } from "react-router-dom";
import ecoBagImg from "../assets/Eco bag with food.png";

/** @type {import("react-router-dom").ActionFunction} */
export const registerAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const res = await axios.post(
      "/api/v1/auth/register",
      {
        email: formData.get("email"),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
  }
};

const RegisterPage = () => {
  return (
    <Flex
      mx="auto"
      my={10}
      maxW="5xl"
      boxShadow="0 8px 16px rgba(171, 190, 209, 0.4)"
      borderRadius="10px"
      justifyContent="space-evenly"
    >
      <Box display={{ base: "none", lg: "unset" }}>
        <Image src={ecoBagImg} alt="eco bag with food" />
      </Box>
      <Box textAlign="center" py={10}>
        <Heading fontSize="3xl" mb={5}>
          Pendaftaran
        </Heading>
        <Box border="solid #EBEBEB 1px" borderRadius="10px" p={5} w={96}>
          <Box as={Form} method="post">
            <FormControl>
              <FormLabel mr="0">
                <Input
                  type="email"
                  name="email"
                  placeholder="Alamat Surel"
                  bgColor="#F1FBF8"
                />
              </FormLabel>
            </FormControl>
            <Text fontSize="x-small" m={5}>
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
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
