import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import PageProtected from "../../protected";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import StockList from "./StockList";
import StockHistory from "./stockHistory";

function StockManagement() {
  return (
    <PageProtected needLogin={true}>
      <AdminProductsLayout heading="Stock Management">
        <Flex
          maxWidth={"max-content"}
          my={10}
          flexDirection={"column"}
          alignItems={"flex-start"}>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Stock</Tab>
              <Tab>History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <StockList />
              </TabPanel>
              <TabPanel>
                <StockHistory />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default StockManagement;
