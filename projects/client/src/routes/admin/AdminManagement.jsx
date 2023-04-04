import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Heading } from "@chakra-ui/react";
import AdminList from "../../components/AdminList";
import UserList from "../../components/UserList";
import ManagerList from "../../components/ManagerList";
import PageProtected from "../protected";
import AdminProductsLayout from "../../components/AdminProductsLayout";

function AdminManagement() {
  return (
    <PageProtected adminOnly={true} needLogin={true}>
      <AdminProductsLayout heading="Update Branch Admin">
        <Flex maxWidth={"max-content"} my={10} flexDirection={"column"} alignItems={"flex-start"}>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Admin</Tab>
              <Tab>User</Tab>
              <Tab>Warehouse Admin</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AdminList />
              </TabPanel>
              <TabPanel>
                <UserList />
              </TabPanel>
              <TabPanel>
                <ManagerList />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </AdminProductsLayout>
    </PageProtected>
  );
}

export default AdminManagement;
