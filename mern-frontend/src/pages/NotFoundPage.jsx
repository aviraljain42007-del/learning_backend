import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>

      <Link to="/">Go to Products</Link>
    </main>
  );
}

export default NotFoundPage;