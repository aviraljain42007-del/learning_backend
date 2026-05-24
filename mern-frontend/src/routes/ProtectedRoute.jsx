import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../redux/slices/authSlice";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;