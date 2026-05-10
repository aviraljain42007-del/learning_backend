import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiGrid } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src="/logo1.png" alt="MARKIT" className={styles.logoImg} />
          <span className={styles.logoText}>MARKIT</span>
        </Link>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ""}`}>
          <Link to="/" className={styles.navLink} onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/products" className={styles.navLink} onClick={() => setMobileOpen(false)}>Products</Link>
          {user && (
            <Link to="/my-orders" className={styles.navLink} onClick={() => setMobileOpen(false)}>My Orders</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className={styles.navLink} onClick={() => setMobileOpen(false)}>Admin</Link>
          )}

          {/* Mobile auth links */}
          <div className={styles.mobileAuth}>
            {!user ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
            )}
          </div>
        </nav>

        <div className={styles.actions}>
          {user && (
            <Link to="/cart" className={styles.cartBtn} id="cart-button">
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
            </Link>
          )}

          {!user ? (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          ) : (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button className={styles.userBtn} onClick={() => setUserMenuOpen(!userMenuOpen)} id="user-menu-button">
                <FiUser size={18} />
                <span>{user.name?.split(" ")[0]}</span>
              </button>

              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <Link to="/my-orders" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <FiPackage size={16} /> My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin/dashboard" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <FiGrid size={16} /> Dashboard
                    </Link>
                  )}
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)} id="mobile-menu-button">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;