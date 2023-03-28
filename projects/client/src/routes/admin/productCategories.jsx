import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Table,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const ProductCategoriesPage = () => {
  return (
    <Box px={8} flex={1}>
      <Heading py={7}>Kategori Produk</Heading>
      <Flex justifyContent="space-between">
        <HStack></HStack>
        <HStack>
          <Button>
            <Icon as={FaPlus} mr={2} />
            Kategori Baru
          </Button>
        </HStack>
      </Flex>
      <Table></Table>
    </Box>
  );
};

export default ProductCategoriesPage;
