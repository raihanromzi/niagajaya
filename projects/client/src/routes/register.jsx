import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const RegisterPage = () => {
  return (
    <Flex
      mx="auto"
      my={10}
      w="5xl"
      boxShadow="0 8px 16px rgba(171, 190, 209, 0.4)"
      borderRadius="10px"
    >
      <Box flex={1} display={{ base: "none", lg: "unset" }}></Box>
      <Box flex={1} textAlign="center" py={10}>
        <Heading fontSize="3xl" mb={5}>
          Pendaftaran
        </Heading>
        <Box mx={14} border="solid #EBEBEB 1px" borderRadius="10px" p={5}>
          <Box as="form" action="" method="post">
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
            <Text fontSize="x-small" mx={4} my={5}>
              Dengan mendaftar, Saya menyetujui&nbsp;
              <Link as={RouterLink} to="#" color="#009262">
                Syarat dan Ketentuan
              </Link>
              &nbsp;serta&nbsp;
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
