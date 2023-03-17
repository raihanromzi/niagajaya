import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PageProtected({
  children,
  needLogin = false,
  guestOnly = false,
}) {
  let navigate = useNavigate();
  let location = useLocation();

  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    if (needLogin && !userSelector?.id) {
      localStorage.setItem("lastPath", location.pathname);
      return navigate("/login", { replace: true });
    }

    if (guestOnly && userSelector?.id) {
      return navigate("/", { replace: true });
    }
  }, []);
  return children;
}

export default PageProtected;
