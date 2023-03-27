import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../config/config";

const ProductDetailPage = () => {
  const routeParams = useParams();

  const [count, setCount] = useState(0);
  const [product, setProduct] = useState(null);

  async function fetchDetailProduct(id) {
    try {
      const res = await axiosInstance.get(`/products/v3/${id}`, {
        withCredentials: true,
      });

      setProduct(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDetailProduct(routeParams.id);
  }, []);

  return (
    <Flex
      mx="auto"
      maxW="5xl"
      boxShadow={{ lg: "0 8px 16px rgba(171, 190, 209, 0.4)" }}
      borderRadius="10px"
      justifyContent="space-evenly"
      flexDir={{ base: "column", lg: "row" }}
      p={"10"}
      gap={10}
    >
      {product ? (
        <>
          {" "}
          <Center flex="1 1 50%">
            <Image src={product.imageUrl} alt="eco bag with food" />
          </Center>
          <VStack alignItems={"start"} flex="1 1 50%" gap={"2"}>
            <Heading fontSize="3xl">{product.name}</Heading>
            <Badge
              w={"max-content"}
              variant="solid"
              colorScheme="blackAlpha"
              textColor={"white"}
            >
              {product.category.name}
            </Badge>
            <Text fontWeight={"semibold"} fontSize="2xl" textColor={"gray.600"}>
              Rp. {product.priceRupiahPerUnit.toLocaleString("id-ID")}
            </Text>
            <HStack justifyContent={"space-between"} w={"full"}>
              <Flex
                alignItems="center"
                textColor="#009262"
                bg={"gray.200"}
                borderRadius={"md"}
              >
                <Button
                  onClick={() => {
                    if (count > 0) {
                      setCount(count - 1);
                    }
                  }}
                  variant="solid"
                  bgColor="gray.200"
                >
                  -
                </Button>
                <Text mx={4}>{count}</Text>
                <Button
                  onClick={() => {
                    if (count < product.totalQuantity) {
                      setCount(count + 1);
                    }
                  }}
                  variant="solid"
                  bgColor="gray.200"
                >
                  +
                </Button>
              </Flex>
              {product.totalQuantity ? (
                <Text textColor="#009262" fontSize={"md"}>
                  Stock Tersedia
                </Text>
              ) : (
                <Text textColor="gray.500" fontSize={"md"}>
                  Stock Tidak Tersedia
                </Text>
              )}
            </HStack>

            <Button
              bgColor="#009262"
              color="#FCFCFC"
              w="full"
              isDisabled={product.totalQuantity === 0 ? true : false}
              _hover={{
                backgroundColor: "#00b377",
              }}
            >
              Tambahkan ke keranjang
            </Button>
            <VStack alignItems={"start"}>
              <Heading fontSize={"md"}>Deskripsi</Heading>
              <Text textColor={"gray.600"}>{product.description}</Text>
            </VStack>
          </VStack>
        </>
      ) : (
        <Center>Loading</Center>
      )}
    </Flex>
  );
};

export default ProductDetailPage;
