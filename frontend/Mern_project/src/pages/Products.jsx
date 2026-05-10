import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import api from "../api/axios";
import ProductCard from "../components/product/productcard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];

  useEffect(() => { fetchProducts(); }, [page, keyword, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/get-allproducts?page=${page}`;
      if (keyword) url += `&keyword=${keyword}`;
      if (category) url += `&category=${category}`;
      const { data } = await api.get(url);
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(Math.ceil((data.filteredProductsCount || 0) / 8) || 1);
      }
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); setKeyword(searchInput); };
  const clearFilters = () => { setKeyword(""); setSearchInput(""); setCategory(""); setPage(1); };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Our Products</h1><p>Discover our curated collection</p></div>
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 10, padding: "4px 4px 4px 16px", background: "#1e2a4a", border: "1.5px solid rgba(148,163,184,0.15)", borderRadius: 12 }}>
            <FiSearch size={18} style={{ color: "#64748b" }} />
            <input type="text" placeholder="Search products..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", color: "#f1f5f9", fontSize: "0.95rem", padding: "10px 0", outline: "none" }} id="product-search" />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <button onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "#16213e", border: "1.5px solid rgba(148,163,184,0.15)", borderRadius: 12, color: "#94a3b8", fontWeight: 500, cursor: "pointer" }}>
            <FiFilter size={16} /> Filters
          </button>
        </div>
        {showFilters && (
          <div style={{ padding: 24, background: "#16213e", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 16, marginBottom: 24 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: 8, display: "block" }}>Category</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setCategory(category === cat ? "" : cat); setPage(1); }} style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", background: category === cat ? "rgba(249,115,22,0.2)" : "rgba(148,163,184,0.08)", color: category === cat ? "#F97316" : "#94a3b8", borderColor: category === cat ? "rgba(249,115,22,0.3)" : "rgba(148,163,184,0.15)" }}>{cat}</button>
              ))}
            </div>
            {(keyword || category) && <button onClick={clearFilters} style={{ marginTop: 12, background: "none", border: "none", color: "#ef4444", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><FiX size={14} /> Clear</button>}
          </div>
        )}
        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : products.length > 0 ? (
          <>
            <div className="product-grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page <= 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => <button key={p} onClick={() => setPage(p)} className={page === p ? "active" : ""}>{p}</button>)}
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>›</button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state"><div className="icon">🔍</div><h2>No Products Found</h2><p>Try adjusting your search</p><button onClick={clearFilters} className="btn btn-secondary">Clear</button></div>
        )}
      </div>
    </div>
  );
}
export default Products;