import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import actions
import { fetchTasks, updateTaskStatus } from "../../features/taskSlice";
import { fetchProjects } from "../../features/projectSlice";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // getting data
  const { list: tasks } = useSelector((state) => state.tasks);
  const { list: projects } = useSelector((state) => state.projects);
  const [activeTab, setActiveTab] = useState("board");

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  // drag n drop funcs
  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDrop = (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    dispatch(updateTaskStatus({ id: taskId, status }));
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const filterTasks = (status) => tasks.filter(t => t.status === status);

  // Task card component
  const TaskCard = ({ task }) => (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white p-3 rounded shadow-sm mb-2 cursor-grab hover:shadow-md transition border border-gray-100"
    >
      <h4 className="font-bold text-gray-800 text-sm">{task.title}</h4>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      <div className="mt-2 text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
        {task.project?.name}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <nav className="bg-white px-4 py-3 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-gray-700 text-lg">My Dashboard</h1>
        <button onClick={handleLogout} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-4">

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            className={`pb-2 px-2 text-sm font-semibold ${activeTab === "board" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("board")}
          >
            Task Board
          </button>
          <button
            className={`pb-2 px-2 text-sm font-semibold ${activeTab === "projects" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("projects")}
          >
            My Projects
          </button>
        </div>

        {/* TASK BOARD (KANBAN) */}
        {activeTab === "board" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* To Do Col */}
            <div
              onDrop={(e) => onDrop(e, "TODO")}
              onDragOver={onDragOver}
              className="bg-gray-200 p-3 rounded-lg min-h-[400px]"
            >
              <h3 className="font-bold text-gray-600 mb-3 text-sm flex justify-between">
                To Do <span className="bg-gray-300 px-2 rounded-full text-xs">{filterTasks("TODO").length}</span>
              </h3>
              {filterTasks("TODO").map(task => <TaskCard key={task.id} task={task} />)}
              {filterTasks("TODO").length === 0 && <p className="text-center text-xs text-gray-400 mt-10">Empty</p>}
            </div>

            {/* In Progress Col */}
            <div
              onDrop={(e) => onDrop(e, "IN_PROGRESS")}
              onDragOver={onDragOver}
              className="bg-blue-100 p-3 rounded-lg min-h-[400px]"
            >
              <h3 className="font-bold text-blue-700 mb-3 text-sm flex justify-between">
                Doing <span className="bg-blue-200 px-2 rounded-full text-xs">{filterTasks("IN_PROGRESS").length}</span>
              </h3>
              {filterTasks("IN_PROGRESS").map(task => <TaskCard key={task.id} task={task} />)}
            </div>

            {/* Done Col */}
            <div
              onDrop={(e) => onDrop(e, "DONE")}
              onDragOver={onDragOver}
              className="bg-green-100 p-3 rounded-lg min-h-[400px]"
            >
              <h3 className="font-bold text-green-700 mb-3 text-sm flex justify-between">
                Done <span className="bg-green-200 px-2 rounded-full text-xs">{filterTasks("DONE").length}</span>
              </h3>
              {filterTasks("DONE").map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  Manager: {p.User?.name}
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500 text-sm">You are not in any project yet.</p>}
          </div>
        )}

      </div>
    </div>
  );
}
