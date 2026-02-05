import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dispatch(login({ email, password })).unwrap();

      if (res.role === "ADMIN") navigate("/admin/dashboard");
      if (res.role === "MANAGER") navigate("/manager/dashboard");
      if (res.role === "USER") navigate("/user/dashboard");
    } catch (err) {
      // error is handled by Redux now
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>TaskFlow</h1>
          <p>Role-based Project & Task Management</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ❌ Error message */}
          {error && (
            <p style={{ color: "red", fontSize: "0.85rem", marginTop: "-8px" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="footer">
          Don’t have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#667eea", fontWeight: 600 }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>

        <p className="footer">
          © {new Date().getFullYear()} TaskFlow
        </p>
      </div>
    </div>
  );
}
