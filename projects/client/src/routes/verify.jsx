import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";

const VerifyPage = () => {
  /** @type {import("react").FormEventHandler<HTMLFormElement>} */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/v1/auth/verify",
        {
          email: e.target.email.value,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Box as="form" method="post" onSubmit={async (e) => handleSubmit(e)}>
        <FormControl>
          <FormLabel mr="0">
            <Input
              type="password"
              name="password"
              placeholder="Kata Kunci"
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
    </>
  );
};

export default VerifyPage;
