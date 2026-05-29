import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginUserThunk, googleLoginThunk } from "../redux/slices/authSlice";
import GoogleLoginButton from "../components/GoogleLoginButton";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const redirectPath = location.state?.from || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }
  async function handleGoogleSuccess(credentialResponse) {
    try {
      setLoading(true);
      setError("");

      const credential = credentialResponse.credential;

      if (!credential) {
        setError("Google credential not found");
        return;
      }

      await dispatch(googleLoginThunk({ credential })).unwrap();

      navigate(redirectPath);
    } catch (error) {
      setError(error || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await dispatch(loginUserThunk(formData)).unwrap();

      navigate(redirectPath);
    } catch (error) {
      setError(error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSuccess(credentialResponse) {
    console.log("Google credential response:", credentialResponse);
    console.log("Google credential:", credentialResponse.credential);

    // Abhi sirf UI + credential check kar rahe hain.
    // Redux thunk next step mein banayenge.
  }

  function handleGoogleError() {
    setError("Google login failed");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Login to continue shopping</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p className="auth-switch">
          New user? <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
