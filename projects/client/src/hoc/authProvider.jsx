import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import user_types from "../redux/auth/types";
import { Center } from "@chakra-ui/react";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/auth/v3", { withCredentials: true })
      .then((res) => {
        dispatch({
          type: user_types.USER_LOGIN,
          payload: res.data.result,
        });
      })
      .catch((err) => {
        if (err.code !== "ERR_NETWORK") {
          dispatch({
            type: user_types.USER_LOGOUT,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return isLoading ? <Center h={"100vh"}>Loading</Center> : children;
};

export default AuthProvider;
