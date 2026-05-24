import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [filterForm, setFilterForm] = useState({
    keyword: "",
    category: "",
    "price[gte]": "",
    "price[lte]": "",
  });

  const [activeFilters, setActiveFilters] = useState({
    keyword: "",
    category: "",
    "price[gte]": "",
    "price[lte]": "",
  });

  const [page, setPage] = useState(1);
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProductsCount / limit));

  async function loadProducts(filters = activeFilters, currentPage = page) {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: currentPage,
        limit,
      };

      if (filters.keyword.trim()) {
        params.keyword = filters.keyword.trim();
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters["price[gte]"]) {
        params["price[gte]"] = filters["price[gte]"];
      }

      if (filters["price[lte]"]) {
        params["price[lte]"] = filters["price[lte]"];
      }

      const data = await getProducts(params);

      setProducts(data.products || []);
      setFilteredProductsCount(data.filteredProductsCount || 0);
      setTotalProducts(data.totalProducts || 0);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts(activeFilters, page);
  }, [page]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleApplyFilters(event) {
    event.preventDefault();

    setActiveFilters(filterForm);

    if (page === 1) {
      loadProducts(filterForm, 1);
    } else {
      setPage(1);
    }
  }

  function handleClearFilters() {
    const emptyFilters = {
      keyword: "",
      category: "",
      "price[gte]": "",
      "price[lte]": "",
    };

    setFilterForm(emptyFilters);
    setActiveFilters(emptyFilters);

    if (page === 1) {
      loadProducts(emptyFilters, 1);
    } else {
      setPage(1);
    }
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage() {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }

  if (loading) {
    return (
      <main className="products-page">
        <p className="status-text">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <p className="error-text">{error}</p>

        <button
          className="retry-btn"
          onClick={() => loadProducts(activeFilters, page)}
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <p>
          Showing {products.length} of {filteredProductsCount} matched products
        </p>
      </div>

      <form className="filters-bar" onSubmit={handleApplyFilters}>
        <input
          name="keyword"
          type="text"
          value={filterForm.keyword}
          onChange={handleFilterChange}
          placeholder="Search products..."
          className="search-input"
        />

        <select
          name="category"
          value={filterForm.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All categories</option>
          <option value="mobile">Mobile</option>
          <option value="laptop">Laptop</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="clothing">Clothing</option>
        </select>

        <input
          name="price[gte]"
          type="number"
          value={filterForm["price[gte]"]}
          onChange={handleFilterChange}
          placeholder="Min price"
          className="price-input"
        />

        <input
          name="price[lte]"
          type="number"
          value={filterForm["price[lte]"]}
          onChange={handleFilterChange}
          placeholder="Max price"
          className="price-input"
        />

        <button type="submit" className="filter-btn">
          Apply
        </button>

        <button
          type="button"
          className="clear-btn"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </form>

      {products.length === 0 ? (
        <p className="status-text">No products found</p>
      ) : (
        <>
          <section className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>

          <div className="pagination">
            <button onClick={goToPreviousPage} disabled={page === 1}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button onClick={goToNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default ProductsPage;