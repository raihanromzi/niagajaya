import { Box, Heading } from "@chakra-ui/react";

const AdminProductsLayout = ({ children, heading }) => {
  return (
    <Box px={8} flex={1}>
      <Heading py={7}>{heading}</Heading>
      {children}
    </Box>
  );
};

export default AdminProductsLayout;
