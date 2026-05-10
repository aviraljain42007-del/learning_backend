import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
        <h1>Create Account</h1>
        <p className="subtitle">Join MARKIT and start shopping</p>

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label className="form-label"><FiUser size={14} style={{ marginRight: 6 }} />Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="register-name"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><FiMail size={14} style={{ marginRight: 6 }} />Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="register-email"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><FiLock size={14} style={{ marginRight: 6 }} />Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="register-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading} id="register-submit">
            {loading ? "Creating account..." : <><FiUserPlus size={16} /> Create Account</>}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;