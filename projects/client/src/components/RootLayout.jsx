import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaInstagram,
  FaShoppingCart,
  FaTwitter,
  FaYoutube,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";
import { Link as RouterLink, Outlet } from "react-router-dom";

const RootLayout = () => {
  const isLoggedin = "a";

  return (
    <>
      <Flex
        as="header"
        bgColor="#009262"
        color="#FCFCFC"
        justifyContent="space-between"
        alignItems="center"
        h={20}
        px={{ base: 6, lg: 10 }}
      >
        <Heading fontSize="xl">Niagajaya</Heading>
        <Flex>
          {isLoggedin ? (
            <>
              <IconButton
                as={RouterLink}
                to="cart"
                icon={<FaShoppingCart />}
                color="#009262"
                bgColor="#FCFCFC"
                mr={4}
                size="lg"
                fontSize="2xl"
                borderRadius="full"
              />
              <Menu>
                <MenuButton>
                  <Avatar />
                </MenuButton>
                <MenuList color="black">
                  <MenuItem
                    as={RouterLink}
                    to="settings/profile"
                    icon={<FaUserCog />}
                  >
                    Pengaturan
                  </MenuItem>
                  <MenuItem icon={<FaSignOutAlt />}>Keluar</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="login" mr={4} variant="outline">
                Masuk
              </Button>
              <Button
                as={RouterLink}
                to="register"
                bgColor="#FCFCFC"
                color="#009262"
              >
                Daftar
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      <Box as="main">
        <Outlet />
      </Box>
      <Box
        as="footer"
        bgColor="#212121"
        color="#FCFCFC"
        p={{ base: 6, lg: 10 }}
      >
        <Flex>
          <Box mr={24} fontWeight="light">
            <Link as={RouterLink} to="#" display="block">
              Tentang Kami
            </Link>
            <Link as={RouterLink} to="#" display="block">
              Blog
            </Link>
            <Link as={RouterLink} to="#" display="block">
              Bantuan
            </Link>
          </Box>
          <Box>
            <Heading as="h3" fontWeight="bold" fontSize="md" mb={4}>
              Cari tahu berita terbaru
            </Heading>
            <Flex justifyContent="space-between">
              <Link as={RouterLink} to="https://www.facebook.com">
                <Icon as={FaFacebook} boxSize={6} />
              </Link>
              <Link as={RouterLink} to="https://www.twitter.com">
                <Icon as={FaTwitter} boxSize={6} />
              </Link>
              <Link as={RouterLink} to="https://www.instagram.com">
                <Icon as={FaInstagram} boxSize={6} />
              </Link>
              <Link as={RouterLink} to="https://www.youtube.com">
                <Icon as={FaYoutube} boxSize={6} />
              </Link>
            </Flex>
          </Box>
        </Flex>
        <Text fontWeight="light" mt={4}>
          © 2023 Niagajaya | Niagajaya adalah merek milik PT Niagajaya Tbk.
          Terdaftar pada Direktorat Jendral Kekayaan Intelektual Republik
          Indonesia.
        </Text>
      </Box>
    </>
  );
};

export default RootLayout;
