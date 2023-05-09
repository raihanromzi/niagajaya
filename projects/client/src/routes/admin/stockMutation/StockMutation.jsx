import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Box,
} from "@chakra-ui/react";
import PageProtected from "../../protected";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import StockMutationCompletedList from "../../../components/StockMutationCompletedList";
import StockMutationCancelled from "../../../components/StockMutationCancelled";
import StockMutationOnProgress from "../../../components/StockMutationOnProgressList";
import { AddStockMutation } from "../../../components/AddStockMutation";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

function StockMutation() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);

  return (
    <PageProtected needLogin={true}>
      <AdminProductsLayout heading="Stock Mutation">
        <Flex
          maxWidth={"max-content"}
          my={10}
          flexDirection={"column"}
          alignItems={"flex-start"}>
          <Tabs variant="soft-rounded" colorScheme="green" isLazy>
            <TabList>
              <Tab>On Progress</Tab>
              <Tab>Completed</Tab>
              <Tab>Cancelled</Tab>
              <Flex alignItems={"center"}>
                <Box ml={"617px"}>
                  <AddStockMutation warehouseId={id} managerId={user.id} />
                </Box>
              </Flex>
            </TabList>

            <TabPanels>
              <TabPanel>
                <StockMutationOnProgress />
              </TabPanel>
              <TabPanel>
                <StockMutationCompletedList />
              </TabPanel>
              <TabPanel>
                <StockMutationCancelled />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default StockMutation;
