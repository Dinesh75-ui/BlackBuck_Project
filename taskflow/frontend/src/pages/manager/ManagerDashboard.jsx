import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// importing thunks from slices
import { fetchProjects, createProject, deleteProject, updateProject, addMember, removeMember } from "../../features/projectSlice";
import { createTask, fetchTasks, updateTaskStatus, deleteTask } from "../../features/taskSlice";
import { logout } from "../../features/auth/authSlice";
import { fetchUsers } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // fetching data from store
  const { list: projects } = useSelector((state) => state.projects);
  const { list: users } = useSelector((state) => state.users);
  const { list: tasks } = useSelector((state) => state.tasks);

  // local state forms
  const [projectData, setProjectData] = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [taskData, setTaskData] = useState({ title: "", description: "", projectId: "", assignedTo: "" });
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
    dispatch(fetchTasks()); // fetch all tasks for manager (backend handles filtering)
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  // handle create or update project
  const handleCreateOrUpdateProject = (e) => {
    e.preventDefault();
    if (editingProject) {
      dispatch(updateProject({ id: editingProject.id, ...projectData }));
      setEditingProject(null);
    } else {
      dispatch(createProject(projectData));
    }
    setProjectData({ name: "", description: "" });
  };

  const handleEditProject = (p) => {
    setEditingProject(p);
    setProjectData({ name: p.name, description: p.description });
    setActiveTab("projects");
  };

  const handleAddMember = async (projectId, userId) => {
    if (!userId) return;
    try {
      await dispatch(addMember({ id: projectId, userId })).unwrap();
      alert("Member added successfully!");
    } catch (err) {
      alert(`Error adding member: ${err}`);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTask(taskData)).unwrap();
      alert("Task Added Successfully!");
      // clear form
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

  // helper to get members safely
  const getProjectMembers = (p) => p.members || [];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-800">Manager Dashboard</h1>
        <button onClick={handleLogout} className="mt-2 md:mt-0 text-red-500 border border-red-200 px-4 py-1 rounded hover:bg-red-50 transition text-sm">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
          {["projects", "team", "tasks"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-4 capitalize font-semibold transition whitespace-nowrap ${activeTab === tab
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "team" ? "Manage Team" : tab === "tasks" ? "Manage Tasks" : "Projects"}
            </button>
          ))}
        </div>

        {/* PROJECTS SECTION */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Create Project Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-lg font-bold mb-4 text-gray-700">{editingProject ? "Update Project" : "Create Project"}</h2>
                <form onSubmit={handleCreateOrUpdateProject} className="flex flex-col gap-4">
                  <input
                    type="text" className="border p-2 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Project Name"
                    value={projectData.name} onChange={(e) => setProjectData({ ...projectData, name: e.target.value })} required
                  />
                  <textarea
                    className="border p-2 rounded focus:outline-none focus:border-blue-500" rows="3"
                    placeholder="Description..."
                    value={projectData.description} onChange={(e) => setProjectData({ ...projectData, description: e.target.value })} required
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                      {editingProject ? "Update" : "Create"}
                    </button>
                    {editingProject && (
                      <button type="button" onClick={() => { setEditingProject(null); setProjectData({ name: "", description: "" }); }} className="bg-gray-300 px-4 rounded text-gray-700">Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Projects List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{p.description}</p>

                    {/* Stats stats with more space */}
                    <div className="mt-4 flex items-center gap-8 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {p._count?.tasks || 0} Tasks
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {getProjectMembers(p).length} Team Members
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditProject(p)} className="text-blue-500 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 text-sm">Edit</button>
                    <button onClick={() => { if (window.confirm("Delete?")) dispatch(deleteProject(p.id)) }} className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-sm">Delete</button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-gray-500 text-center py-10">No projects yet.</p>}
            </div>
          </div>
        )}

        {/* TEAM MANAGEMENT */}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 border-b pb-2 mb-4 flex justify-between">
                  {p.name} <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Team</span>
                </h3>

                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Add Member</p>
                  <select
                    className="w-full border p-2 rounded"
                    onChange={(e) => { handleAddMember(p.id, e.target.value); e.target.value = ""; }}
                  >
                    <option value="">Select User...</option>
                    {/* filter out existing members */}
                    {users.filter(u => u.role === "USER" && !getProjectMembers(p).find(m => m.id === u.id)).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getProjectMembers(p).map(m => (
                    <span key={m.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {m.name}
                      <button onClick={() => { if (window.confirm("Remove user?")) dispatch(removeMember({ id: p.id, userId: m.id })) }} className="text-red-400 hover:text-red-600 font-bold">×</button>
                    </span>
                  ))}
                  {getProjectMembers(p).length === 0 && <span className="text-gray-400 italic text-sm">No members added yet.</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE TASKS */}
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Assign New Task</h2>
                <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600">Project</label>
                    <select
                      className="w-full border p-2 rounded mt-1"
                      value={taskData.projectId} onChange={(e) => setTaskData({ ...taskData, projectId: e.target.value })} required
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-600">Assign To</label>
                    <select
                      className="w-full border p-2 rounded mt-1"
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

                  <input
                    type="text" className="border p-2 rounded" placeholder="Task Title"
                    value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} required
                  />
                  <textarea
                    className="border p-2 rounded" rows="3" placeholder="Description details..."
                    value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} required
                  />

                  <button className="bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition mt-2">
                    Create Task
                  </button>
                </form>
              </div>
            </div>

            {/* Task List */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold mb-4 text-gray-700">All Tasks</h2>
              <div className="flex flex-col gap-3">
                {tasks.slice().reverse().map(t => (
                  <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">{t.title}</h4>
                      <p className="text-xs text-gray-500">{t.project?.name} • <span className="text-blue-600">Assigned to: {t.user?.name || "Unassigned"}</span></p>
                      <p className="text-xs mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-600">{t.status}</p>
                    </div>
                    <button onClick={() => handleDeleteTask(t.id)} className="text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded">Delete</button>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-gray-400 text-center py-10">No tasks found.</p>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
