import {
  Avatar,
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TabPanel,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import ProfileItem from "./ProfileItem";

const ProfilePanel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <TabPanel as={VStack} spacing={4}>
      <Box w="full">
        <Avatar size="2xl" />
      </Box>
      <ProfileItem
        id="name"
        label="Nama"
        value="John Doe"
        handleClick={onOpen}
      />
      <ProfileItem
        id="email"
        label="Alamat Surel"
        value="johndoe@gmail.com"
        handleClick={onOpen}
      />
      <ProfileItem
        id="password"
        label="Kata Sandi"
        value="****"
        handleClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </TabPanel>
  );
};

export default ProfilePanel;
