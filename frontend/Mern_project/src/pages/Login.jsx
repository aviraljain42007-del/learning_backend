import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <img src="/logo1.png" alt="MARKIT" style={{ width: 60, height: 60, objectFit: "contain", margin: "0 auto 12px" }} />
        </div>
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your MARKIT account</p>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label"><FiMail size={14} style={{ marginRight: 6 }} />Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="login-email"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><FiLock size={14} style={{ marginRight: 6 }} />Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="login-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading} id="login-submit">
            {loading ? "Signing in..." : <><FiLogIn size={16} /> Sign In</>}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;