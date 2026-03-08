import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { openModal } from "../../Action/ModalAction";

/**
 * Protects routes so only logged-in users can access them.
 * If not logged in, redirects to home and opens the login modal.
 */
const ProtectedRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      dispatch(openModal("open", "login"));
    }
  }, [userInfo, dispatch]);

  if (!userInfo) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
