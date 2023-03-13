import { Alert, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, Box, Button, Card, CardBody, CardHeader, Center, Flex, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, Select, Spacer, Text, Textarea, useDisclosure, VStack } from '@chakra-ui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { axiosInstance } from '../config/config';
import { MdLocationOn } from 'react-icons/md';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios';

export default function AddressPage() {
    const [action, setAction] = useState("list")
    const [status, setStatus] = useState(false);
    const [msg, setMsg] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [citys, setCitys] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(0)
    const [selectedCity, setSelectedCity] = useState(0)
    const [street, setStreet] = useState("")
    const [detail, setDetail] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [subdistrict, setSubdistrict] = useState("")
    const [position, setPosition] = useState({})
    const [showMap, setShowMap] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)

    async function fetchAddresses() {
        const res = await axiosInstance.get("/address", { withCredentials: true });
        if (res.status === 200) {
            console.log("jalan");
            const listAddress = await res.data.map((data) => {
                return { id: data.id, main: data.main, district: data.district, detail: data.detail }
            })
            setAddresses(listAddress)
        }
    }

    async function fetchAddress() {
        const res = await axiosInstance.get("/address/" + selectedAddress.id, { withCredentials: true });
        if (res.status === 200) {
            console.log("jalan fetchAddress");
            console.log(res.data);
            setSelectedProvince(parseInt(res.data.province))
            // setSelectedProvince(parseInt(res.data.city))
            setDetail(res.data.detail)
            setPosition({
                lat: res.data.latitude,
                lng: res.data.longitude,
            })
        }
    }

    async function fetchProvinces() {
        const res = await axiosInstance.get("/address/v1/province");
        if (res.status === 200) {
            const listProvince = await res.data.results.map((data) => {
                return { id: data.province_id, name: data.province }
            })
            setProvinces(listProvince)
        }
    }

    async function fetchCitys(province_id) {
        const res = await axiosInstance.get(`/address/v1/city?province=${province_id}`);
        if (res.status === 200) {
            const listCity = await res.data.results.map((data) => {
                return { id: data.city_id, name: data.city_name }
            })
            setCitys(listCity)
        }
    }

    async function fetchPosition(province_name, city_name, street) {
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/?addressdetails=1&street=${street}&city=${city_name}&country=Indonesia&state=${province_name}&format=json&limit=1`);
            if (res.status === 200) {
                if (res.data.length) {
                    console.log(res.data[0]?.lat);
                    console.log(res.data[0]?.lon);
                    setSubdistrict(res.data[0].address.village)
                    setPostalCode(res.data[0].address.postCode)
                    setPosition({
                        lat: res.data[0]?.lat,
                        lng: res.data[0]?.lon,
                    })
                }
            }
        } catch (error) {
            console.log("Error fetch Position");
            console.log(error);
        }
    }

    async function submitHandler() {
        try {
            const res = await axiosInstance.post(`/address`, {
                latitude: position.lat,
                longitude: position.lon,
                province: provinces[selectedProvince - 1]?.id,
                city: selectedCity.id,
                district: `${street}, ${subdistrict}, ${selectedCity.name}, ${selectedCity.province}, ${postalCode}`,
                detail: detail,
            }, { withCredentials: true });
            if (res.status === 200) {
                setAction("list")
            }
        } catch (error) {
            console.log("error");
            console.log(error);
        }
    }

    async function deleteHandler() {
        try {
            const res = await axiosInstance.delete(`/address/${selectedAddress.id}`, { withCredentials: true });
            if (res.status === 200) {
                console.log("deleteHandler");
                console.log(res.data);
                setAction("list")
                fetchAddresses()
            }
        } catch (error) {
            console.log("error");
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAddresses()
    }, []);


    useEffect(() => {
        if (action === "list") {
            console.log("Go To List");
            setSelectedProvince(0)
            setDetail("")
            // setStreet("")
        } else if (action === "create") {
            console.log("Go To create");
            fetchProvinces()
        } else if (action === "edit") {
            console.log("Go To edit");
            fetchProvinces()
            fetchAddress()
        }
    }, [action]);

    useEffect(() => {
        setCitys([])
        setSelectedCity(0)
        if (selectedProvince) {
            fetchCitys(provinces[selectedProvince - 1]?.id)
        }
    }, [selectedProvince]);

    useEffect(() => {
        setPosition({})
        setShowMap(false)
    }, [street, selectedCity, selectedProvince]);

    useEffect(() => {
        if (selectedProvince && selectedCity && street) {
            console.log("ni jalan 2");
            fetchPosition(provinces[selectedProvince - 1]?.name, citys[selectedCity - 1]?.name, street)
        }
    }, [showMap]);

    function DraggableMarker() {
        const markerRef = useRef(null)
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        console.log("coor");
                        console.log(marker.getLatLng());
                        setPosition(marker.getLatLng())
                    }
                },
            }),
            [],
        )

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
                <Popup minWidth={90}>
                    <span>
                        Penunjuk dapat digeser.
                    </span>
                </Popup>
            </Marker>
        )
    }

    function Delete() {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const cancelRef = useRef()

        return (
            <>
                <Button onClick={onOpen} colorScheme={'teal'} variant='outline' fontWeight={'medium'}>Hapus</Button>
                <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    isOpen={isOpen}
                    isCentered
                >
                    <AlertDialogOverlay />

                    <AlertDialogContent>
                        <AlertDialogHeader>Hapus Alamat</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            Apakah Anda yakin ingin menghapus alamat ini?
                        </AlertDialogBody>
                        <AlertDialogFooter >
                            <Button variant={'outline'}
                                colorScheme={'teal'} ref={cancelRef} onClick={onClose}>
                                Nanti Saja
                            </Button>
                            <Button ml={3}
                                bgColor={'#009262'}
                                textColor={'white'}
                                onClick={() => {
                                    deleteHandler()
                                }}>
                                Ya, Hapus
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    }

    return (
        <Box w={'md'} minH="50vh" p={'4'} mx="auto"
            my={10}
            maxW="5xl"
            boxShadow="0 8px 16px rgba(171, 190, 209, 0.4)"
            borderRadius="10px">
            {action === "list" ?
                <VStack w={'full'} >
                    <HStack w={'full'}>
                        <Box >
                            <Heading fontSize="3xl" mb={2}>
                                Daftar Alamat
                            </Heading>
                        </Box>
                        <Spacer />
                        <Box onClick={() => { setAction("create") }}>
                            <Heading fontSize="sm" textColor={'green.400'} mb={2}>
                                Tambah alamat
                            </Heading>
                        </Box>
                    </HStack>
                    {
                        addresses.length ?
                            <VStack w={'full'}>
                                {
                                    addresses.map((address) => {
                                        return (
                                            <Card key={address.id} variant={'outline'} borderColor={'green.400'} w={'full'} bgColor="#F1FBF8">
                                                <CardBody  >
                                                    <HStack w={'full'} justifyContent={'space-between'}>
                                                        {address.main ?
                                                            <Heading
                                                                size={'xs'} mb={'1'} bg={'gray.500'}
                                                                paddingX={2} paddingY={1} textColor={'white'}
                                                                borderRadius={"md"}
                                                            >Alamat Utama
                                                            </Heading> : <Box></Box>}
                                                        <Heading size={'xs'} mb={'1'} textColor={'green.400'}
                                                            onClick={() => {
                                                                setAction("edit")
                                                                setSelectedAddress({ id: address.id })
                                                            }}
                                                        >Edit</Heading>
                                                    </HStack>
                                                    <Heading size='md'>{address.detail}</Heading>
                                                    <Text fontSize={'sm'} textColor={'gray'}>{address.district}</Text>
                                                </CardBody>
                                            </Card>
                                        );
                                    })
                                }
                            </VStack> : null
                    }
                </VStack> :
                action === 'create' ?
                    <VStack w={'full'} >
                        <Box mb={'3'}
                            onClick={() => {
                                // submitHandler()
                                setAction("list")
                            }}>
                            <Heading fontSize="3xl" mb={5}>
                                Tambah Alamat
                            </Heading>
                        </Box>
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
                            <FormLabel>Provinsi</FormLabel>
                            <Select placeholder='Pilih Provinsi'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Selected Province");
                                    console.log(e.target.value);
                                    setSelectedProvince(e.target.value)
                                }}
                            >
                                {provinces.map((province, index) => {
                                    return <option key={province.id} value={index + 1} >{province.name}</option>;
                                })}
                            </Select>
                        </FormControl>
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
                            <FormLabel>Kota/Kabupaten</FormLabel>
                            <Select placeholder='Pilih Kota/Kabupaten'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Selected City");
                                    console.log(e.target.value);
                                    setSelectedCity(e.target.value)
                                }}>
                                {citys.map((city, index) => {
                                    return <option key={city.id} value={index + 1}>{city.name}</option>;
                                })}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Jalan</FormLabel>
                            <Input type={'text'} placeholder='Nama Jalan'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Nama Jalan");
                                    console.log(e.target.value);
                                    setStreet(e.target.value)
                                }}>
                            </Input>
                        </FormControl>
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
                            <FormLabel>Keterangan</FormLabel>
                            <Textarea
                                placeholder='No. rumah/gedung dan lain-lain.'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Detail");
                                    console.log(e.target.value);
                                    setDetail(e.target.value)
                                }}
                            />
                        </FormControl>
                        {showMap && !Object.keys(position).length ? <Alert status='error'>
                            <AlertIcon />
                            Alamat tidak dapat ditemukan.
                        </Alert> : null}
                        <Button colorScheme='teal' variant='outline' w={'full'} leftIcon={<MdLocationOn />}
                            isDisabled={selectedCity ? false : true}
                            onClick={() => {
                                console.log("showMap");
                                setShowMap(!showMap)
                            }}>
                            Tambah Titik Lokasi
                        </Button>
                        {showMap && Object.keys(position).length ? <MapContainer center={position}
                            zoom={16}
                            scrollWheelZoom={false}
                            style={{ height: 400, width: "100%", zIndex: 94 }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggableMarker />
                        </MapContainer> : null}
                        <Button
                            colorScheme='teal' w={'full'}
                            isDisabled={Object.keys(position).length ? false : true}
                            onClick={() => {
                                submitHandler()
                            }}
                        >Simpan</Button>
                    </VStack> :
                    /// edit
                    <VStack w={'full'} >
                        <Box mb={'3'}
                            onClick={() => {
                                // submitHandler()
                                setAction("list")
                            }}>
                            <Heading fontSize="3xl" mb={5}>
                                Edit Alamat
                            </Heading>
                        </Box>
                        <FormControl>
                            <FormLabel>Provinsi</FormLabel>
                            <Select placeholder='Pilih Provinsi'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Selected Province");
                                    console.log(e.target.value);
                                    setSelectedProvince(e.target.value)
                                }}
                                value={selectedProvince ? selectedProvince : 0}
                            >
                                {provinces.map((province, index) => {
                                    return <option key={province.id} value={index + 1} >{province.name}</option>;
                                })}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Kota/Kabupaten</FormLabel>
                            <Select placeholder='Pilih Kota/Kabupaten'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Selected City");
                                    console.log(e.target.value);
                                    setSelectedCity(e.target.value)
                                }}>
                                {citys.map((city, index) => {
                                    return <option key={city.id} value={index + 1}>{city.name}</option>;
                                })}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Jalan</FormLabel>
                            <Input type={'text'} placeholder='Nama Jalan'
                                bgColor="#F1FBF8"
                                onChange={(e) => {
                                    console.log("Nama Jalan");
                                    console.log(e.target.value);
                                    setStreet(e.target.value)
                                }}>
                            </Input>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Keterangan</FormLabel>
                            <Textarea
                                placeholder='No. rumah/gedung dan lain-lain.'
                                bgColor="#F1FBF8"
                                value={detail}
                                onChange={(e) => {
                                    console.log("Detail");
                                    console.log(e.target.value);
                                    setDetail(e.target.value)
                                }}
                            />
                        </FormControl>
                        {showMap && !Object.keys(position).length ? <Alert status='error'>
                            <AlertIcon />
                            Alamat tidak dapat ditemukan.
                        </Alert> : null}
                        <Button colorScheme='teal' variant='outline' w={'full'} leftIcon={<MdLocationOn />}
                            isDisabled={selectedCity ? false : true}
                            onClick={() => {
                                console.log("showMap");
                                setShowMap(!showMap)
                            }}>
                            Tambah Titik Lokasi
                        </Button>
                        {showMap && Object.keys(position).length ? <MapContainer center={position}
                            zoom={16}
                            scrollWheelZoom={false}
                            style={{ height: 400, width: "100%", zIndex: 94 }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggableMarker />
                        </MapContainer> : null}
                        <HStack w={'full'}>
                            <Delete />
                            <Button
                                textColor={'white'}
                                fontWeight={'medium'}
                                bgColor={"#009262"} w={'full'}
                                isDisabled={Object.keys(position).length ? false : true}
                                onClick={() => {
                                    submitHandler()
                                }}
                            >Simpan</Button>
                        </HStack>

                    </VStack>
            }
        </Box >
    )
}
