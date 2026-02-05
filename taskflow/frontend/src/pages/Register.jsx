import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewRole, setPreviewRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔍 Role preview based on email
  const detectRole = (emailValue) => {
    if (emailValue.endsWith("@admin.com")) return "ADMIN";
    if (emailValue.endsWith("@manager.com")) return "MANAGER";
    return "USER";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setPreviewRole(detectRole(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>TaskFlow</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Name</label>
            <input required onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input required onChange={handleEmailChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🔐 Role Preview */}
          <div className="form-group">
            <label>Role (auto-assigned)</label>
            <input value={previewRole} disabled />
            <small style={{ color: "#777", marginTop: "4px" }}>
              Role is assigned automatically based on email domain
            </small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="footer">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#667eea", fontWeight: 600 }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
