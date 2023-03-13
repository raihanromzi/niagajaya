import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import ProfilePanel from "../components/ProfilePanel";

const SettingsPage = () => {
  return (
    <>
      <Heading>Pengaturan</Heading>
      <Tabs isFitted>
        <TabList>
          <Tab>Profil</Tab>
          <Tab>Alamat</Tab>
        </TabList>
        <TabPanels>
          <ProfilePanel />
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SettingsPage;
