import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password })).unwrap();

    if (res.role === "ADMIN") navigate("/admin/dashboard");
    if (res.role === "MANAGER") navigate("/manager/dashboard");
    if (res.role === "USER") navigate("/user/dashboard");
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Please enter your details
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-600"
            />
            Remember for 30 days
          </label>

          <button
            type="button"
            className="text-purple-600 hover:underline"
          >
            Forgot password
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2.5 rounded-md font-medium hover:bg-purple-700 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  </div>
);



}
