import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h2>MARKIT</h2>

      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/products">Products</Link> |{" "}
        <Link to="/cart">Cart</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </nav>

      <hr />
    </header>
  );
}

export default Header;