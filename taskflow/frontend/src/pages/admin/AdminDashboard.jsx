import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUser, deleteUser, updateUser } from "../../features/userSlice";
import { fetchProjects } from "../../features/projectSlice";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Users, LayoutGrid, LogOut, UserPlus, Trash2, Edit2, Shield, User as UserIcon, Briefcase, Search, Plus, Menu, X } from "lucide-react";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: users } = useSelector((state) => state.users);
  const { list: projects } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
  const [editingId, setEditingId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateUser({ id: editingId, ...formData })).unwrap();
        setEditingId(null);
        setShowAddUser(false);
      } else {
        await dispatch(createUser(formData)).unwrap();
      }
      setFormData({ name: "", email: "", password: "", role: "USER" });
    } catch (err) {
      alert(`Operation failed: ${err}`);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setShowAddUser(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-secondary-200 
        flex flex-col transition-transform duration-300 lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary-600 font-extrabold text-2xl tracking-tight">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
              TF
            </div>
            TaskFlow
          </div>
          <button
            className="lg:hidden p-2 text-secondary-400 hover:bg-secondary-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-semibold transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutGrid className="w-5 h-5" />
            Dashboard
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-secondary-500 hover:bg-secondary-50 rounded-xl font-medium transition-all group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users className="w-5 h-5 group-hover:text-primary-500" />
            Users
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-secondary-500 hover:bg-secondary-50 rounded-xl font-medium transition-all group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Briefcase className="w-5 h-5 group-hover:text-primary-500" />
            Projects
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-secondary-900 lg:hidden">TaskFlow</h1>
            <h1 className="text-xl font-bold text-secondary-900 hidden lg:block">Admin Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 bg-secondary-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all w-64"
              />
            </div>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="bg-primary-600 text-white p-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Add User</span>
            </button>
            <button onClick={handleLogout} className="lg:hidden text-red-500 p-2 hover:bg-red-50 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 flex items-center gap-5 group hover:border-primary-200 transition-all cursor-default">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-secondary-500 font-semibold text-sm">Total Users</p>
                <p className="text-2xl font-black text-secondary-900 leading-none mt-1">{users.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 flex items-center gap-5 group hover:border-primary-200 transition-all cursor-default">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <p className="text-secondary-500 font-semibold text-sm">Total Projects</p>
                <p className="text-2xl font-black text-secondary-900 leading-none mt-1">{projects.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 flex items-center gap-5 group hover:border-primary-200 transition-all cursor-default">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <p className="text-secondary-500 font-semibold text-sm">Admins</p>
                <p className="text-2xl font-black text-secondary-900 leading-none mt-1">
                  {users.filter(u => u.role === 'ADMIN').length}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 flex items-center gap-5 group hover:border-primary-200 transition-all cursor-default">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <LayoutGrid className="w-7 h-7" />
              </div>
              <div>
                <p className="text-secondary-500 font-semibold text-sm">Active Now</p>
                <p className="text-2xl font-black text-secondary-900 leading-none mt-1">{users.length > 0 ? '5' : '0'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Form Section */}
            {showAddUser && (
              <div className="lg:col-span-1 animate-fadeIn">
                <div className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-primary-600" />
                      {editingId ? "Update User" : "Add New User"}
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary-500 uppercase px-1">Full Name</label>
                      <input
                        type="text" name="name" placeholder="Full Name" required
                        value={formData.name} onChange={handleChange}
                        className="input-field py-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary-500 uppercase px-1">Email Address</label>
                      <input
                        type="email" name="email" placeholder="Email Address" required
                        value={formData.email} onChange={handleChange}
                        className="input-field py-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary-500 uppercase px-1">Password</label>
                      <input
                        type="password" name="password"
                        placeholder={editingId ? "New Password (Optional)" : "Password"}
                        required={!editingId}
                        value={formData.password} onChange={handleChange}
                        className="input-field py-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary-500 uppercase px-1">User Role</label>
                      <select
                        name="role" value={formData.role} onChange={handleChange}
                        className="input-field py-2 !pr-10 appearance-none bg-no-repeat bg-[right_1rem_center]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundSize: '1.2rem' }}
                      >
                        <option value="USER">Standard User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button type="submit" className="flex-1 btn-primary text-sm">
                        {editingId ? "Save Changes" : "Create User"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingId(null); setShowAddUser(false); setFormData({ name: "", email: "", password: "", role: "USER" }); }}
                        className="px-4 py-2 border border-secondary-200 rounded-xl text-sm font-semibold text-secondary-600 hover:bg-secondary-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className={`${showAddUser ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all`}>
              <div className="bg-white rounded-3xl shadow-premium border border-secondary-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-secondary-50 flex items-center justify-between bg-white">
                  <h2 className="text-xl font-bold text-secondary-900">Registered Users</h2>
                  <div className="flex gap-2">
                    <div className="text-xs font-medium text-secondary-500 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100">
                      Showing {users.length} users
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F8FAFC]">
                        <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">User Profile</th>
                        <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Email Address</th>
                        <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider text-center">Role Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-50">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-[#F8FAFC]/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-secondary-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary-500">{user.email}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5
                              ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                user.role === 'MANAGER' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                  'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-500' : user.role === 'MANAGER' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                title="Edit User"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-10 h-10 text-secondary-200" />
                      </div>
                      <p className="text-secondary-400 font-medium">No users registered yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
