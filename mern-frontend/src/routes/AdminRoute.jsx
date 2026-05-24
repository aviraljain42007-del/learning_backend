import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAdmin,
  selectIsAuthenticated,
} from "../redux/slices/authSlice";

function AdminRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <main className="page-container">
        <h1>Access Denied</h1>
        <p>You are not allowed to access this page.</p>
      </main>
    );
  }

  return children;
}

export default AdminRoute;