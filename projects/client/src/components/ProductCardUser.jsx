import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const ProductCardUser = ({ product }) => {
  const handleClick = () => {
    console.log("Card clicked!");
  };

  return (
    <Card maxW={["md", "xs", "xs", "lg"]} onClick={handleClick}>
      <CardBody mb={{ lg: "4", xl: "2" }}>
        <Image
          src={product.imageUrl}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          objectFit="cover"
          h={"60%"}
          w={"full"}
        />
        <Stack mt="6" spacing="1">
          <Text fontSize="2xl">
            Rp{product.priceRupiahPerUnit.toLocaleString("id-ID")}
          </Text>
          <Heading size="md">{product.name}</Heading>
          <Text>Stock {product.totalQuantity}</Text>
          <Badge w={"max-content"} variant="solid" colorScheme="orange">
            {product.category.name}
          </Badge>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button
          bgColor="#009262"
          color="#FCFCFC"
          w="full"
          leftIcon={<FaPlus />}
          isDisabled={product.totalQuantity === 0 ? true : false}
          _hover={{
            bg: "gray.200",
            color: "gray.600",
          }}
        >
          Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCardUser;
