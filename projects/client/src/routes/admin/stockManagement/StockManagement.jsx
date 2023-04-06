import React, { useState, useEffect } from "react";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import PageProtected from "../../protected";
import { useSelector } from "react-redux";
import { SimpleGrid, Box, Text, Flex, Icon, Spinner } from "@chakra-ui/react";
import WarehouseCard from "../../../components/WarehouseCard";
import { useGetAllWarehousesQuery } from "../../../redux/store";

function StockManagement() {
  const user = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const {
    data: warehouses,
    isError,
    isLoading,
  } = useGetAllWarehousesQuery({
    page,
    size,
    user,
  });

  console.log("====================================");
  console.log(user.role);
  console.log("====================================");

  let contentWarehouses;
  if (isLoading) {
    contentWarehouses = <Spinner />;
  } else if (isError) {
    contentWarehouses = <div>Error loading Content.</div>;
  } else {
    contentWarehouses = (
      <SimpleGrid columns={[1, 2, 3]} spacing="40px">
        {warehouses.data.map((warehouse) => {
          return (
            <WarehouseCard
              key={warehouse.id}
              id={warehouse.id}
              name={warehouse.name || "No Name"}
              manager={warehouse.manager.names[0].name || "No Manager"}
              city={warehouse.city || "No City"}
              province={warehouse.province || "No Province"}
            />
          );
        })}
      </SimpleGrid>
    );
  }

  return (
    <PageProtected needLogin={true}>
      <AdminProductsLayout heading="Stock Management">
        {user.role === "ADMIN" ? <h1>Admin</h1> : <h2>Bukan Admin</h2>}
        <Box mt={5}>{contentWarehouses}</Box>
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default StockManagement;
