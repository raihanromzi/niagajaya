import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import user_types from "../redux/auth/types";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("auth jalan");
    axiosInstance
      .get("/auth/v3", { withCredentials: true })
      .then((res) => {
        console.log("res.data: ", res.data);
        console.log("res.data.result: ", res.data.result);
        dispatch({
          type: user_types.USER_LOGIN,
          payload: res.data.result,
        });
      })
      .catch((err) => {
        console.error("error: ", err);
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

  return isLoading ? <div>Loadingxxxxxx</div> : children;
};

export default AuthProvider;
