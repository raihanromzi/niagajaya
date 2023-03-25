import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../config/config";
import PaginationWarehouse from "../components/PaginationWarehouse";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";

const WarehousePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  async function fetchTotalPage() {
    try {
      let queryParams = "";
      const filteredParams = { size };
      Object.keys(filteredParams)
        .filter(
          (key) =>
            filteredParams[key] !== undefined && filteredParams[key] !== ""
        )
        .forEach((key, index) => {
          const prefix = index === 0 ? "?" : "&";
          queryParams += `${prefix}${key}=${encodeURIComponent(
            filteredParams[key]
          )}`;
        });
      const res = await axiosInstance.get(`/warehouses/v3${queryParams}`, {
        withCredentials: true,
      });
      setTotalPages(res.data.totalPage);
    } catch (error) {}
  }
  const deleteHandler = async () => {
    try {
      await axiosInstance.delete(`/warehouses/v1/${selectedWarehouse?.id}`, {
        withCredentials: true,
      });
      setSelectedWarehouse(null);
      onClose();
      applyFilter({ page: 1 });
    } catch (error) {
      console.error(error);
    }
  };

  function applyFilter({ name, page, sortBy }) {
    let queryParams = "";
    const filteredParams = { name, sortBy, page, size };
    Object.keys(filteredParams)
      .filter(
        (key) => filteredParams[key] !== undefined && filteredParams[key] !== ""
      )
      .forEach((key, index) => {
        const prefix = index === 0 ? "?" : "&";
        queryParams += `${prefix}${key}=${encodeURIComponent(
          filteredParams[key]
        )}`;
      });
    navigate(`/warehouses${queryParams}`);
  }

  const handlePageChange = (page) => {
    applyFilter({ page });
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTotalPage();
  }, [size]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const { name, sortBy, page, size } = Object.fromEntries(
      queryParams.entries()
    );
    setSize(size);
    async function fetchWarehouses() {
      try {
        let queryParams = "";
        const filteredParams = { name, sortBy, page, size };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
          )
          .forEach((key, index) => {
            const prefix = index === 0 ? "?" : "&";
            queryParams += `${prefix}${key}=${encodeURIComponent(
              filteredParams[key]
            )}`;
          });
        const res = await axiosInstance.get(`/warehouses${queryParams}`, {
          withCredentials: true,
        });
        setWarehouses(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchWarehouses();
  }, [location]);

  return (
    <VStack alignItems={"start"} gap={5}>
      <Heading w={"full"} textAlign={"center"}>
        Mengelola Warehouse
      </Heading>
      {
        <>
          <HStack w={"full"} justifyContent={"space-between"}>
            <Heading size={"lg"}>Daftar Warehouse</Heading>
            <Button
              size={"sm"}
              onClick={() => {
                navigate("/warehouses/create");
              }}
            >
              Buat Warehouse
            </Button>
          </HStack>
          <Table>
            <Thead>
              <Tr>
                <Th>Nama Warehouse</Th>
                <Th>Email Manager</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {warehouses
                ? warehouses.map((warehouse) => (
                    <Tr key={warehouse.id}>
                      <Td>{warehouse.name}</Td>
                      <Td>{warehouse.manager.email}</Td>
                      <Td>
                        <IconButton
                          icon={<MdEdit />}
                          aria-label="Edit"
                          size="md"
                          mr="2"
                          onClick={() => {
                            navigate(`/warehouses/edit/${warehouse.id}`);
                          }}
                        />
                        <IconButton
                          icon={<MdDelete />}
                          aria-label="Delete"
                          size="md"
                          onClick={() => {
                            onOpen();
                            setSelectedWarehouse({
                              id: warehouse.id,
                              name: warehouse.name,
                            });
                          }}
                        />
                      </Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
          <Center w={"full"}>
            <PaginationWarehouse
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Center>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Hapus Warehouse</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Apakah Anda yakin ingin menghapus {selectedWarehouse?.name}?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant={"outline"}
                  colorScheme={"teal"}
                  ref={cancelRef}
                  onClick={onClose}
                >
                  Nanti Saja
                </Button>
                <Button
                  ml={3}
                  bgColor={"#009262"}
                  textColor={"white"}
                  onClick={deleteHandler}
                >
                  Ya, Hapus
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      }
    </VStack>
  );
};

export default WarehousePage;
