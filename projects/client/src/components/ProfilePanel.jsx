import {
  Avatar,
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TabPanel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

const ProfilePanel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <TabPanel>
      <Box>
        <Avatar />
      </Box>
      <Box>
        <Text fontWeight="bold">Nama</Text>
        <IconButton icon={<FaEdit />} onClick={onOpen} />
      </Box>
      <Box>
        <Text fontWeight="bold">Alamat Surel</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Kata Sandi</Text>
      </Box>
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
