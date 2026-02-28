import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../../features/taskSlice";
import { fetchProjects } from "../../features/projectSlice";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  CheckCircle2,
  Clock,
  PlayCircle,
  LogOut,
  Folder,
  Plus,
  Search,
  Bell,
  User,
  ChevronRight,
  MoreVertical,
  Calendar,
  Layers
} from "lucide-react";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: tasks } = useSelector((state) => state.tasks);
  const { list: projects } = useSelector((state) => state.projects);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  const handleUpdateStatus = (id, status) => {
    dispatch(updateTaskStatus({ id, status }));
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const statusColors = {
    TODO: "bg-secondary-100 text-secondary-600 ring-secondary-200",
    IN_PROGRESS: "bg-blue-50 text-blue-600 ring-blue-100",
    DONE: "bg-emerald-50 text-emerald-600 ring-emerald-100"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">

      {/* Sidebar - Desktop */}
      <aside className="w-full lg:w-64 bg-white border-r border-secondary-200 flex flex-col sticky top-0 lg:h-screen z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 text-primary-600 font-extrabold text-2xl tracking-tight">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
              TF
            </div>
            TaskFlow
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="px-4 py-2 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Workspace</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-primary-50 text-primary-600 transition-all">
            <Layout className="w-5 h-5" />
            My Board
          </button>

          <div className="pt-4 px-4 py-2 text-[10px] font-black text-secondary-400 uppercase tracking-widest">My Projects</div>
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {projects.slice(0, 5).map(p => (
              <button key={p.id} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-secondary-500 hover:bg-secondary-50 transition-all text-sm group">
                <Folder className="w-4 h-4 group-hover:text-primary-500" />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-secondary-100">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-bold text-secondary-900 hidden md:block">Kanban Board</h1>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text" placeholder="Search tasks..."
                className="w-full bg-secondary-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-2 text-secondary-400 hover:bg-secondary-50 rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-secondary-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-secondary-900">{user?.name}</p>
                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 font-bold border border-secondary-200 ring-2 ring-white">
                {user?.name?.charAt(0) || <User className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 flex-1 overflow-x-auto">
          <div className="flex gap-6 h-full min-h-[calc(100vh-160px)]">

            {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
              <div key={status} className="flex-1 min-w-[320px] max-w-[400px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-secondary-900 capitalize flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${status === 'DONE' ? 'bg-emerald-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-secondary-400'}`}></span>
                      {status.replace("_", " ")}
                    </h3>
                    <span className="bg-white px-2 py-0.5 rounded-lg border border-secondary-200 text-[10px] font-black text-secondary-400">
                      {getTasksByStatus(status).length}
                    </span>
                  </div>
                  <button className="p-1.5 text-secondary-400 hover:bg-white rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 bg-secondary-50/50 rounded-3xl border-2 border-dashed border-secondary-200/50 p-4 space-y-4 overflow-y-auto scrollbar-hide">
                  {getTasksByStatus(status).map((t) => (
                    <div key={t.id} className="bg-white p-5 rounded-2xl shadow-premium border border-secondary-100 group hover:border-primary-200 transition-all animate-fadeIn">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg border border-primary-100 uppercase tracking-widest">
                          {t.project?.name || "No Project"}
                        </span>
                        <button className="text-secondary-300 hover:text-secondary-600"><MoreVertical className="w-4 h-4" /></button>
                      </div>

                      <h4 className="font-bold text-secondary-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{t.title}</h4>
                      <p className="text-xs text-secondary-500 line-clamp-2 mb-4 font-medium leading-relaxed">{t.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-secondary-50">
                        <div className="flex items-center gap-2 text-secondary-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Today</span>
                        </div>

                        <div className="relative group/actions">
                          <select
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ring-1 appearance-none cursor-pointer transition-all
                              ${statusColors[status]}`}
                            value={t.status}
                            onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getTasksByStatus(status).length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-center opacity-40">
                      <Layers className="w-8 h-8 text-secondary-300 mb-2" />
                      <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">No Tasks</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
}
