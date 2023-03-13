import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function PageProtected({ children, myPath, needLogin = false, guestOnly = false }) {
  let navigate = useNavigate();
  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    //wajib login
    console.log("userSelector");
    console.log(userSelector);
    if (needLogin && !userSelector?.id) {
      localStorage.setItem("lastPath", myPath);
      return navigate("/login", { replace: true });
    }

    if (guestOnly && userSelector?.id) {
      return navigate("/", { replace: true });
    }

  }, []);
  return children;
}

export default PageProtected;
