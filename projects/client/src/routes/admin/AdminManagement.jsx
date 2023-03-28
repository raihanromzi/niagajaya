import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Heading } from "@chakra-ui/react";
import AdminList from "../../components/AdminList";
import UserList from "../../components/UserList";
import ManagerList from "../../components/ManagerList";

function AdminManagement() {
  return (
    <Flex maxWidth={"max-content"} mx={10} my={20} flexDirection={"column"} alignItems={"flex-start"}>
      <Heading>Update Branch Admin</Heading>
      <Tabs>
        <TabList mt={50}>
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
  );
}

export default AdminManagement;
