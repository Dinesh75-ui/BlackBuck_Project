import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject, deleteProject, updateProject, addMember, removeMember } from "../../features/projectSlice";
import { createTask, fetchTasks, updateTaskStatus, deleteTask } from "../../features/taskSlice";
import { logout } from "../../features/auth/authSlice";
import { fetchUsers } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Plus,
  Users,
  CheckSquare,
  Edit2,
  Trash2,
  LogOut,
  Folder,
  UserPlus,
  X,
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  Calendar,
  Menu
} from "lucide-react";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects } = useSelector((state) => state.projects);
  const { list: users } = useSelector((state) => state.users);
  const { list: tasks } = useSelector((state) => state.tasks);

  const [projectData, setProjectData] = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [taskData, setTaskData] = useState({ title: "", description: "", projectId: "", assignedTo: "" });
  const [activeTab, setActiveTab] = useState("projects");
  const [showAddProject, setShowAddProject] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  const handleCreateOrUpdateProject = (e) => {
    e.preventDefault();
    if (editingProject) {
      dispatch(updateProject({ id: editingProject.id, ...projectData }));
      setEditingProject(null);
      setShowAddProject(false);
    } else {
      dispatch(createProject(projectData));
      setShowAddProject(false);
    }
    setProjectData({ name: "", description: "" });
  };

  const handleEditProject = (p) => {
    setEditingProject(p);
    setProjectData({ name: p.name, description: p.description });
    setShowAddProject(true);
    setActiveTab("projects");
  };

  const handleAddMember = async (projectId, userId) => {
    if (!userId) return;
    try {
      await dispatch(addMember({ id: projectId, userId })).unwrap();
    } catch (err) {
      alert(`Error adding member: ${err}`);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTask(taskData)).unwrap();
      setTaskData({ title: "", description: "", projectId: "", assignedTo: "" });
    } catch (err) {
      alert(`Error adding task: ${err}`);
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      dispatch(deleteTask(id));
    }
  };

  const getProjectMembers = (p) => p.members || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-50 lg:hidden"
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
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
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

        <nav className="flex-1 px-4 py-4 space-y-2 flex flex-col overflow-y-auto">
          <button
            onClick={() => { setActiveTab("projects"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
              ${activeTab === "projects" ? "bg-primary-50 text-primary-600" : "text-secondary-500 hover:bg-secondary-50"}`}
          >
            <Folder className="w-5 h-5" />
            Projects
          </button>
          <button
            onClick={() => { setActiveTab("team"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
              ${activeTab === "team" ? "bg-primary-50 text-primary-600" : "text-secondary-500 hover:bg-secondary-50"}`}
          >
            <Users className="w-5 h-5" />
            Manage Team
          </button>
          <button
            onClick={() => { setActiveTab("tasks"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
              ${activeTab === "tasks" ? "bg-primary-50 text-primary-600" : "text-secondary-500 hover:bg-secondary-50"}`}
          >
            <CheckSquare className="w-5 h-5" />
            Manage Tasks
          </button>

          <div className="mt-auto border-t border-secondary-100 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-secondary-900 capitalize">
              {activeTab} Management
            </h1>
          </div>

          {activeTab === "projects" && (
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          )}
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">

          {/* PROJECTS SECTION */}
          {activeTab === "projects" && (
            <div className="space-y-8 animate-fadeIn">
              {showAddProject && (
                <div className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 animate-slideUp">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                      <Folder className="w-5 h-5 text-primary-600" />
                      {editingProject ? "Update Project" : "New Project"}
                    </h2>
                    <button onClick={() => { setShowAddProject(false); setEditingProject(null); }} className="p-2 hover:bg-secondary-50 rounded-full transition-colors">
                      <X className="w-5 h-5 text-secondary-400" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateOrUpdateProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-secondary-500 uppercase px-1">Project Name</label>
                        <input
                          type="text" className="input-field"
                          placeholder="e.g. Website Redesign"
                          value={projectData.name} onChange={(e) => setProjectData({ ...projectData, name: e.target.value })} required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-secondary-500 uppercase px-1">Description</label>
                        <textarea
                          className="input-field min-h-[120px]"
                          placeholder="What is this project about?"
                          value={projectData.description} onChange={(e) => setProjectData({ ...projectData, description: e.target.value })} required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-end gap-3">
                      <button className="btn-primary w-full py-3">
                        {editingProject ? "Update Project" : "Launch Project"}
                      </button>
                      <button type="button" onClick={() => { setShowAddProject(false); setEditingProject(null); }} className="w-full py-3 border border-secondary-200 rounded-xl font-semibold text-secondary-600 hover:bg-secondary-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl shadow-premium border border-secondary-100 hover:border-primary-200 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:bg-primary-100 transition-colors"></div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                          <Folder className="w-6 h-6" />
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleEditProject(p)} className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (window.confirm("Delete?")) dispatch(deleteProject(p.id)) }} className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-secondary-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{p.name}</h3>
                      <p className="text-secondary-500 text-sm line-clamp-2 h-10 mb-6 font-medium leading-relaxed">{p.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-secondary-50">
                        <div className="flex -space-x-2">
                          {getProjectMembers(p).slice(0, 3).map((m, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-secondary-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-secondary-600 ring-1 ring-secondary-200" title={m.name}>
                              {m.name.charAt(0)}
                            </div>
                          ))}
                          {getProjectMembers(p).length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-primary-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary-600 ring-1 ring-primary-200">
                              +{getProjectMembers(p).length - 3}
                            </div>
                          )}
                          {getProjectMembers(p).length === 0 && (
                            <span className="text-[10px] text-secondary-400 font-bold uppercase tracking-wider">No Team</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100">
                            <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
                            {p._count?.tasks || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && !showAddProject && (
                  <div className="col-span-full py-24 text-center space-y-4">
                    <div className="w-24 h-24 bg-secondary-50 rounded-full flex items-center justify-center mx-auto ring-4 ring-white shadow-lg shadow-secondary-100">
                      <Folder className="w-12 h-12 text-secondary-200" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-secondary-700">No projects found</h3>
                      <p className="text-secondary-400 max-w-xs mx-auto text-sm">Create your first project to start managing tasks and your team efficiently.</p>
                    </div>
                    <button onClick={() => setShowAddProject(true)} className="btn-primary inline-flex items-center gap-2 py-2.5">
                      <Plus className="w-5 h-5" />
                      Create Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEAM MANAGEMENT */}
          {activeTab === "team" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl shadow-premium border border-secondary-100 overflow-hidden group hover:border-primary-200 transition-all">
                    <div className="p-6 border-b border-secondary-50 bg-secondary-50/50 group-hover:bg-white transition-colors">
                      <h3 className="font-bold text-secondary-900 flex items-center justify-between">
                        {p.name}
                        <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-1 rounded-lg border border-primary-200 font-black uppercase tracking-widest">Team</span>
                      </h3>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">Add New Member</label>
                        <div className="relative group/select">
                          <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 group-focus-within/select:text-primary-500 transition-colors" />
                          <select
                            className="w-full input-field py-2 pl-10 text-sm appearance-none bg-no-repeat bg-[right_1rem_center]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                            onChange={(e) => { handleAddMember(p.id, e.target.value); e.target.value = ""; }}
                          >
                            <option value="">Select User...</option>
                            {users.filter(u => u.role === "USER" && !getProjectMembers(p).find(m => m.id === u.id)).map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">
                          Current Members ({getProjectMembers(p).length})
                        </label>
                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                          {getProjectMembers(p).map(m => (
                            <div key={m.id} className="bg-secondary-50 border border-secondary-100 flex items-center justify-between p-3 rounded-2xl group/member hover:border-primary-200 hover:bg-white transition-all">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                  {m.name.charAt(0)}
                                </div>
                                <span className="text-sm font-bold text-secondary-700">{m.name}</span>
                              </div>
                              <button
                                onClick={() => { if (window.confirm("Remove user?")) dispatch(removeMember({ id: p.id, userId: m.id })) }}
                                className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg lg:opacity-0 lg:group-hover/member:opacity-100 transition-all font-bold"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {getProjectMembers(p).length === 0 && (
                            <div className="py-6 text-center border-2 border-dashed border-secondary-100 rounded-2xl">
                              <p className="text-xs text-secondary-400 font-medium italic">No team members yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE TASKS */}
          {activeTab === "tasks" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              {/* Form Card */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-3xl shadow-premium border border-secondary-100 sticky top-24">
                  <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    Assign Task
                  </h2>
                  <form onSubmit={handleCreateTask} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">Target Project</label>
                      <select
                        className="w-full input-field py-3 !pr-10 text-sm appearance-none bg-no-repeat bg-[right_1rem_center]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                        value={taskData.projectId} onChange={(e) => setTaskData({ ...taskData, projectId: e.target.value, assignedTo: "" })} required
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">Assignee</label>
                      <select
                        className="w-full input-field py-3 !pr-10 text-sm appearance-none bg-no-repeat bg-[right_1rem_center] disabled:opacity-50"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                        value={taskData.assignedTo} onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })} required
                        disabled={!taskData.projectId}
                      >
                        <option value="">Select Member</option>
                        {taskData.projectId &&
                          (projects.find(p => p.id === taskData.projectId)?.members || [])
                            .map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">Task Details</label>
                      <input
                        type="text" className="input-field py-3 text-sm mb-3" placeholder="Task Title (e.g. Design Login UI)"
                        value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} required
                      />
                      <textarea
                        className="input-field min-h-[100px] text-sm py-3" placeholder="Describe the requirements..."
                        value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} required
                      />
                    </div>

                    <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Create Task
                    </button>
                  </form>
                </div>
              </div>

              {/* Task Activity Feed/List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-secondary-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    Task Tracker
                  </h2>
                  <div className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-secondary-200">
                    {tasks.length} Active Tasks
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.slice().reverse().map(t => (
                    <div key={t.id} className="bg-white p-5 rounded-3xl shadow-premium border border-secondary-100 flex items-center gap-4 group hover:border-primary-200 transition-all">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                        ${t.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' :
                          t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-secondary-50 text-secondary-600'}`}>
                        <ClipboardList className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">{t.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Folder className="w-3 h-3" />
                            {t.project?.name}
                          </p>
                          <div className="w-1 h-1 rounded-full bg-secondary-200 hidden md:block"></div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            To: {t.user?.name || "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1
                          ${t.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' :
                            t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 ring-blue-100' : 'bg-secondary-50 text-secondary-600 ring-secondary-100'}`}>
                          {t.status.replace('_', ' ')}
                        </span>

                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="p-2 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="py-24 text-center space-y-3 bg-secondary-50/50 rounded-3xl border-2 border-dashed border-secondary-100 px-6">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm ring-1 ring-secondary-200">
                        <Calendar className="w-10 h-10 text-secondary-200" />
                      </div>
                      <h3 className="text-secondary-700 font-bold uppercase tracking-widest text-sm">No tasks tracked yet</h3>
                      <p className="text-secondary-400 text-xs font-medium max-w-xs mx-auto">Start by assigning tasks to your team members from the sidebar form.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
