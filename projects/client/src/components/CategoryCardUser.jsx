import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CategoryCardUser = ({ category, hue, saturation, lightness }) => {
  const navigate = useNavigate();
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const clickHandler = async () => {
    navigate(`/products?categoryId=${category.id}`);
  };

  return (
    <Button
      w="200px"
      h="200px"
      bgColor={color}
      borderRadius="md"
      boxShadow="md"
      p={4}
      onClick={clickHandler}
      //   _hover={{
      //     backgroundColor: "#009262",
      //     textColor: "white",
      //   }}
    >
      <Flex h="100%" alignItems="center" justifyContent="center">
        <Center>
          <Text fontWeight="bold" fontSize="xl">
            {category.name}
          </Text>
        </Center>
      </Flex>
    </Button>
  );
};

export default CategoryCardUser;
