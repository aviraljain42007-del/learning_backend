import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  logoutUserThunk,
  selectIsAdmin,
  selectUser,
} from "../redux/slices/authSlice";
import { resetCartState } from "../redux/slices/cartSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  async function handleLogout() {
    try {
      await dispatch(logoutUserThunk()).unwrap();

      dispatch(resetCartState());

      navigate("/login");
    } catch (error) {
      console.log(error || "Logout failed");
    }
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo-link">
        <h2 className="logo">MyShop</h2>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Products</NavLink>

        <NavLink to="/cart">Cart</NavLink>

        {user ? (
          <>
            <NavLink to="/orders">Orders</NavLink>

            {isAdmin && <NavLink to="/admin">Admin</NavLink>}

            <span className="nav-user">Hi, {user.name}</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;