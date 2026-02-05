import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUser, deleteUser, updateUser } from "../../features/userSlice";
import { fetchProjects } from "../../features/projectSlice";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // getting users from redux
  const { list: users } = useSelector((state) => state.users);
  const { list: projects } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout()); // logging out
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // updating user
        await dispatch(updateUser({ id: editingId, ...formData })).unwrap();
        alert("User updated successfully!");
        setEditingId(null);
      } else {
        // creating new user
        await dispatch(createUser(formData)).unwrap();
        alert("User created successfully!");
      }
      // reset form
      setFormData({ name: "", email: "", password: "", role: "USER" });
    } catch (err) {
      alert(`Operation failed: ${err}`);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    // setting form data for edit
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <button onClick={handleLogout} className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* User Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            {editingId ? "Update User" : "Add New User"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text" name="name" placeholder="Full Name" required
              value={formData.name} onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="email" name="email" placeholder="Email Address" required
              value={formData.email} onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="password" name="password" placeholder={editingId ? "New Password (Optional)" : "Password"}
              required={!editingId}
              value={formData.password} onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              name="role" value={formData.role} onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition">
                {editingId ? "Save Changes" : "Add User"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: "", email: "", password: "", role: "USER" }); }} className="bg-gray-400 text-white px-4 rounded">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Overview Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Dashboard Stats</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 text-center rounded-lg">
              <p className="text-blue-500 font-bold text-xs uppercase">Users</p>
              <p className="text-3xl font-extrabold text-gray-800">{users.length}</p>
            </div>
            <div className="p-4 bg-green-50 text-center rounded-lg">
              <p className="text-green-500 font-bold text-xs uppercase">Projects</p>
              <p className="text-3xl font-extrabold text-gray-800">{projects.length}</p>
            </div>
          </div>

          <h3 className="font-bold text-gray-600 mb-2 text-sm uppercase">Latest Projects</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            {projects.slice(0, 3).map(p => (
              <li key={p.id} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-semibold">{p.name}</span>
                <span className="text-gray-400 text-xs">by {p.User?.name}</span>
              </li>
            ))}
            {projects.length === 0 && <p className="text-gray-400 italic">No projects yet.</p>}
          </ul>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-700 mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-gray-600">Name</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-gray-600">Email</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Role</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 text-sm text-gray-700 font-medium">{user.name}</td>
                  <td className="p-3 text-sm text-gray-500">{user.email}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                   ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'MANAGER' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700 font-bold text-sm">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
