import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", formData);
      alert("Registration Done! Please login now.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* Registration Card */}
      <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2 tracking-tight">
          Join TaskFlow
        </h1>
        <p className="text-sm text-center text-gray-400 mb-8 italic">
          (Note: Use @admin.com for Admin access)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center font-semibold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 disabled:opacity-70 shadow-md"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-800 font-bold transition"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
