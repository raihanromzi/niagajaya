import { Avatar, Box, Flex, Heading, Link, Text, Icon, VStack, Center } from "@chakra-ui/react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const RootLayout = ({ children }) => {
    const userSelector = useSelector((state) => state.auth);

    return (
        <Flex flexDirection={"column"} minH={'100vh'}>
            <Flex
                as="header"
                bgColor="#009262"
                color="#FCFCFC"
                justifyContent="space-between"
                alignItems="center"
                h={20}
                px={{ base: 6, lg: 10 }}
                flexGrow={'1'}
            >
                <Heading fontSize="xl">Niagajaya</Heading>
                <Box>
                    {userSelector?.id ? (
                        <>
                            <Link as={RouterLink} to="cart"></Link>
                            <Link as={RouterLink} to="profile">
                                <Avatar />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                as={RouterLink}
                                to="login"
                                display="inline-block"
                                mr={8}
                                fontWeight="bold"
                                py={2.5}
                                px={5}
                                borderRadius="10px"
                                border="solid 1px"
                            >
                                Masuk
                            </Link>
                            <Link
                                as={RouterLink}
                                to="register"
                                bgColor="#FCFCFC"
                                color="#009262"
                                display="inline-block"
                                py={2.5}
                                px={5}
                                borderRadius="10px"
                                fontWeight="bold"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </Box>
            </Flex>
            <Center as="main" flexGrow={'4'}>
                {/* <Outlet /> */}
                {children}
            </Center>
            <Box
                as="footer"
                bgColor="#212121"
                color="#FCFCFC"
                p={{ base: 6, lg: 10 }}
                flexGrow={'1'}
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
                            <Link
                                as={RouterLink}
                                to="https://www.facebook.com"
                                display="block"
                            >
                                <Icon as={FaFacebook} />
                            </Link>
                            <Link
                                as={RouterLink}
                                to="https://www.twitter.com"
                                display="block"
                            >
                                <Icon as={FaTwitter} />
                            </Link>
                            <Link
                                as={RouterLink}
                                to="https://www.instagram.com"
                                display="block"
                            >
                                <Icon as={FaInstagram} />
                            </Link>
                            <Link
                                as={RouterLink}
                                to="https://www.youtube.com"
                                display="block"
                            >
                                <Icon as={FaYoutube} />
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
        </Flex>
    );
};

export default RootLayout;