import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import "./index.css";
import axios from "./api";
import { FiSun, FiMoon, FiPlus } from "react-icons/fi";

function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState("light");
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All Tasks");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setTaskToEdit(null);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
    setShowForm(false);
    setTaskToEdit(null);
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  const categoryOptions = ["All Tasks", "Work", "Personal", "Others"];

  return (
    <div>
      <div className="app-header">
        <h1 className="app-title">TASK MANAGER</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
      </div>

      <button className="add-task-toggle" onClick={toggleForm}>
        <FiPlus /> {taskToEdit ? "Edit Task" : "Add Task"}
      </button>

      {showForm && (
        <AddTaskForm onTaskAdded={handleTaskAdded} taskToEdit={taskToEdit} />
      )}

      <div className="filter-section">
        <div className="category-filter">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              className={`filter-button ${
                categoryFilter === cat ? "active-filter" : ""
              }`}
              onClick={() => {
                setCategoryFilter(cat);
                setStatusFilter("All"); 
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="task-list">
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}        
          setStatusFilter={setStatusFilter}  
          fetchTasks={fetchTasks}
        />
      </div>
    </div>
  );
}

export default App;












