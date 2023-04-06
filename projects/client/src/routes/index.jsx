import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Carousel from "../components/Carousel";

const IndexPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const toast = useToast();
  useEffect(() => {
    if (!userSelector.id) {
      toast({
        position: "bottom-left",
        title: "Anda belum terverfikasi",
        description: "Silahkan login dengan mengklik tombol masuk",
        status: "info",
        duration: 8000,
        isClosable: true,
      });
    }
  }, []);
  return (
    <>
      <Carousel />
    </>
  );
};

export default IndexPage;
