import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../config/config';
import user_types from '../redux/auth/types';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    console.log('auth jalan');
    await axiosInstance
      .get('/auth/v3', { withCredentials: true })
      .then(res => {
        console.log('res.data.result');
        console.log(res.data);
        console.log(res.data.result);
        dispatch({
          type: user_types.USER_LOGIN,
          payload: res.data.result,
        });
      })
      .catch(err => {
        console.log('error');
        console.log(err);
        if (err.code !== 'ERR_NETWORK') {
          dispatch({
            type: user_types.USER_LOGOUT,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? <div>Loadingxxxxxx</div> : children;
};

export default AuthProvider;
