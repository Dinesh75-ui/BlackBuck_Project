import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, role }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute role="MANAGER">
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
