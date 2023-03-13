import { Alert, AlertIcon, Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, Image, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from 'yup';
import { axiosInstance } from "../config/config";
import paperBagImg from "../assets/paper-bag.png";
import { useDispatch } from "react-redux";
import user_types from "../redux/auth/types";

export default function LoginPage() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [enable, setEnable] = useState(false);
    const [status, setStatus] = useState(false);
    const [msg, setMsg] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .required('Email tidak boleh kosong')
                .email('Email tidak sesuai format'),
            password: Yup.string().required('Password tidak boleh kosong'),
        }),
        onSubmit: async () => {
            console.log(formik.values);

            await axiosInstance
                .post('/auth/v2', formik.values, { withCredentials: true }).then((res) => {
                    console.log(res.status);
                    if (res.status === 200) {
                        dispatch({
                            type: user_types.USER_LOGIN,
                            payload: res.data.result,
                        });
                        const lastPath = localStorage.getItem("lastPath");
                        if (lastPath) {
                            navigate(lastPath, { replace: true });

                        } else {

                            navigate('/', { replace: true });

                        }
                    }
                })
                .catch(error => {
                    console.log('error');
                    console.log(error);
                    setStatus(true);
                    setMsg(error.response.data.message);
                });

        },
    });

    useEffect(() => {
        let { email, password } = formik.values;
        if (email && password) {
            setEnable(true);
        } else {
            setEnable(false);
        }
    }, [formik.values]);

    return (
        <Flex
            mx="auto"
            my={10}
            maxW="5xl"
            boxShadow="0 8px 16px rgba(171, 190, 209, 0.4)"
            borderRadius="10px"
            justifyContent="space-evenly"
            h={'full'}
        >
            <Box display={{ base: "none", lg: "unset" }}>
                <Image src={paperBagImg} alt="eco bag with food" />
            </Box>
            <Box textAlign="center" py={10}>
                <Heading fontSize="3xl" mb={5}>
                    Masuk ke akun Anda
                </Heading>
                <VStack border="solid #EBEBEB 1px" borderRadius="10px" p={5} w={96}>
                    <FormControl>
                        {status ? (
                            <Alert
                                status="error"
                                zIndex={2}
                                variant="top-accent"
                                fontSize={'md'}
                                mb={'1'}
                            >
                                <AlertIcon />
                                {msg}
                            </Alert>
                        ) : null}
                        <Input
                            type="email"
                            name="email"
                            bgColor="#F1FBF8"
                            placeholder="Email"
                            onChange={e => formik.setFieldValue('email', e.target.value)}
                        />
                        <FormHelperText w={'full'} textAlign={'start'}>{formik.errors.email}</FormHelperText>

                    </FormControl>
                    <FormControl>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            bgColor="#F1FBF8"
                            onChange={e => formik.setFieldValue('password', e.target.value)}
                        />
                        <FormHelperText w={'full'} textAlign={'start'}>{formik.errors.password}</FormHelperText>

                    </FormControl>
                    <Button
                        bgColor="#009262" color="#FCFCFC" w="full"
                        onClick={formik.handleSubmit}
                        isDisabled={enable ? false : true}
                        // _disabled={{
                        //     backgroundColor: "#009262"
                        // }}
                        _hover={{
                            backgroundColor: "#00b377"

                        }}
                    >
                        Masuk
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}


