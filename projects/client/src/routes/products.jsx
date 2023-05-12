import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Tag,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProductCardUser from "../components/ProductCardUser";
import { FaPlus } from "react-icons/fa";
import { axiosInstance } from "../config/config";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdSearch } from "react-icons/md";
import PaginationNumber from "../components/PaginationNumber";

const ProductsPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(2);
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [categoryId, setCategoryId] = useState();
  const [tempCategoryId, setTempCategoryId] = useState();
  const [tempSortBy, setTempSortBy] = useState();
  const [sortBy, setSortBy] = useState();
  const [size, setSize] = useState();
  const [categories, setCategories] = useState([]);

  const options = [
    {
      label: "Produk Terbaru",
      value: "latest",
    },
    {
      label: "Harga Tertinggi",
      value: "highest",
    },
    {
      label: "Harga Terendah",
      value: "lowest",
    },
  ];

  function filterQueryParams({ name, categoryId, sortBy, page, size }) {
    let queryParams = "";
    const filteredParams = { name, categoryId, sortBy, page, size };
    Object.keys(filteredParams)
      .filter(
        (key) => filteredParams[key] !== undefined && filteredParams[key] !== ""
      )
      .forEach((key, index) => {
        if (key === "name") {
          setFilterValue("Nama");
        }
        const prefix = index === 0 ? "?" : "&";
        queryParams += `${prefix}${key}=${encodeURIComponent(
          filteredParams[key]
        )}`;
      });
    return queryParams;
  }

  function applyFilter({ name, categoryId, page, sortBy, size }) {
    const result = filterQueryParams({ name, categoryId, sortBy, page, size });
    navigate(`/products${result}`);
  }

  const handlePageChange = (page) => {
    applyFilter({ name, categoryId, page, sortBy, size });
    setCurrentPage(page);
  };

  async function fetchCategories() {
    try {
      const res = await axiosInstance.get(`/categories?size=9999`, {
        withCredentials: true,
      });
      setCategories(res.data);
    } catch (error) {}
  }

  useEffect(() => {
    if (!userSelector.id) {
      toast({
        position: "bottom-left",
        title: "Anda belum terverfikasi",
        description:
          "Silahkan login agar dapat mengakses fitur-fitur yang disediakan",
        status: "info",
        duration: 8000,
        isClosable: true,
      });
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (filterValue !== "Nama") {
      setTempName("");
    }
  }, [filterValue]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const { name, categoryId, sortBy, page, size } = Object.fromEntries(
      queryParams.entries()
    );

    setCurrentPage(page);

    if (name !== undefined) {
      setName(name);
      setTempName(name);
    }

    if (categoryId !== undefined) {
      setCategoryId(categoryId);
      setTempCategoryId(categoryId);
    } else {
      setTempCategoryId("");
    }

    if (sortBy === undefined) {
      setSortBy("latest");
      setTempSortBy("latest");
    } else {
      setSortBy(sortBy);
      setTempSortBy(sortBy);
    }
    setSize(size);
    async function fetchProducts({ name, categoryId, sortBy, page, size }) {
      try {
        const result = filterQueryParams({
          name,
          categoryId,
          sortBy,
          page,
          size,
        });
        const res = await axiosInstance.get(`/products${result}`, {
          withCredentials: true,
        });
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts({ name, categoryId, sortBy, page, size });
  }, [location]);

  useEffect(() => {
    async function fetchTotalPage({ name, categoryId, sortBy, size }) {
      try {
        const result = filterQueryParams({
          name,
          categoryId,
          sortBy,
          size,
        });
        const res = await axiosInstance.get(`/products/v2${result}`, {
          withCredentials: true,
        });
        setTotalPages(res.data.totalPage);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalPage({ name, categoryId, sortBy, size });
  }, [name, categoryId, size]);

  function TagCategory() {
    const category = categories.find((category) => {
      return category.id == categoryId;
    });
    return <Tag>{category?.name}</Tag>;
  }

  function TagSorting() {
    const sort = options.find((option) => {
      return option.value == sortBy;
    });
    return <Tag>{sort?.label}</Tag>;
  }

  return (
    <>
      <Box mb={3}>
        <HStack>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button onClick={onOpen}>Tambah Filter</Button>
            <IconButton onClick={onOpen} icon={<FaPlus />} />
          </ButtonGroup>
          <Modal
            isCentered
            isOpen={isOpen}
            onClose={() => {
              setTempCategoryId(categoryId);
              setTempSortBy(sortBy);
              onClose();
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Filter dengan</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <RadioGroup
                  colorScheme={"teal"}
                  onChange={setFilterValue}
                  defaultValue={filterValue}
                >
                  <HStack spacing="24px">
                    <Radio value="">Tidak Memfilter</Radio>
                    <Radio value="Nama">Nama</Radio>
                  </HStack>
                </RadioGroup>
              </ModalBody>
              {filterValue ? (
                <>
                  <ModalHeader>Pencarian</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<MdSearch />}
                      />
                      <Input
                        focusBorderColor="teal.600"
                        type="text"
                        placeholder="Cari Produk"
                        value={tempName}
                        onChange={(e) => {
                          setTempName(e.target.value);
                        }}
                      />
                    </InputGroup>
                  </ModalBody>
                </>
              ) : null}
              <ModalHeader>Pilih kategori</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <RadioGroup
                  onChange={setTempCategoryId}
                  value={tempCategoryId}
                  colorScheme={"teal"}
                >
                  <Flex gap={"4"} flexWrap={"wrap"}>
                    <Radio key={0} value="">
                      Tidak diterapkan
                    </Radio>
                    {categories.map((category) => {
                      return (
                        <Radio
                          key={category.id}
                          value={category.id.toString()}
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {category.name}
                        </Radio>
                      );
                    })}
                  </Flex>
                </RadioGroup>
              </ModalBody>
              <ModalHeader>Urutkan dengan</ModalHeader>
              <ModalBody>
                <RadioGroup
                  onChange={setTempSortBy}
                  defaultValue={tempSortBy}
                  value={tempSortBy}
                  colorScheme={"teal"}
                >
                  <Flex gap={"4"} flexWrap={"wrap"}>
                    {options.map((option, index) => {
                      return (
                        <Radio key={index} value={option.value}>
                          {option.label}
                        </Radio>
                      );
                    })}
                  </Flex>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="teal"
                  textColor={"white"}
                  fontWeight={"semibold"}
                  onClick={() => {
                    applyFilter({
                      name: tempName,
                      page: 1,
                      categoryId: tempCategoryId,
                      sortBy: tempSortBy,
                    });
                    setCurrentPage(1);
                    onClose();
                  }}
                >
                  Terapkan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {categories && categoryId ? <TagCategory /> : null}
          {sortBy ? <TagSorting /> : null}
        </HStack>
      </Box>
      {products.length !== 0 ? (
        <>
          {" "}
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(5, 1fr)",
            ]}
            gap={6}
            mb={3}
          >
            {products.map((product) => {
              return <ProductCardUser key={product.id} product={product} />;
            })}
          </Grid>
          <Center>
            <PaginationNumber
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Center>
        </>
      ) : (
        <Center>Produk tidak ditemukan</Center>
      )}
    </>
  );
};

export default ProductsPage;
