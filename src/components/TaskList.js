import React from "react";
import axios from "../api";

function TaskList({
  tasks,
  categoryFilter,
  statusFilter,
  setStatusFilter,
  onEdit,
  fetchTasks,
}) {
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString("en-GB");
    const time = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  };

  const getStatus = (task) => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    if (task.completed) return "Completed";
    if (deadline > now) return "Pending";
    return "Failed";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "Pending":
        return "status-pending";
      case "Failed":
        return "status-failed";
      default:
        return "";
    }
  };

  const handleDelete = async (taskId) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;
    try {
      await axios.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await axios.patch(`/tasks/${task.id}`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task completion:", err);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      const status = getStatus(task);
      const matchesCategory =
        categoryFilter === "All Tasks" ||
        task.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesCategory && matchesStatus;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const failedCount = tasks.filter(
    (task) =>
      getStatus(task) === "Failed" &&
      (categoryFilter === "All Tasks" ||
        task.category.toLowerCase() === categoryFilter.toLowerCase())
  ).length;

  const pendingCount = tasks.filter(
    (task) =>
      getStatus(task) === "Pending" &&
      (categoryFilter === "All Tasks" ||
        task.category.toLowerCase() === categoryFilter.toLowerCase())
  ).length;

  return (
    <div>
      {tasks.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          {failedCount > 0 && pendingCount > 0 && (
            <p>
              ❗{" "}
              <span
                className="clickable-status"
                onClick={() => setStatusFilter("Failed")}
              >
                {failedCount} task{failedCount > 1 ? "s" : ""} failed
              </span>{" "}
              and{" "}
              <span
                className="clickable-status"
                onClick={() => setStatusFilter("Pending")}
              >
                {pendingCount} pending
              </span>
              .
            </p>
          )}

          {failedCount > 0 && pendingCount === 0 && (
            <p>
              ❗{" "}
              <span
                className="clickable-status"
                onClick={() => setStatusFilter("Failed")}
              >
                {failedCount} task{failedCount > 1 ? "s" : ""} failed
              </span>
              .
            </p>
          )}

          {failedCount === 0 && pendingCount > 0 && (
            <p>
              <span
                className="clickable-status"
                onClick={() => setStatusFilter("Pending")}
              >
                {pendingCount} task{pendingCount > 1 ? "s" : ""} pending
              </span>
              .
            </p>
          )}

          {filteredTasks.length > 0 && failedCount === 0 && pendingCount === 0 && (
           <p>✅ All tasks completed!</p>
          )}
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <p>No tasks match the selected filters.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredTasks.map((task) => {
            const status = getStatus(task);
            return (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      style={{ marginRight: "8px" }}
                    />
                    <strong>{task.title}</strong> | {task.category} |{" "}
                    {formatDateTime(task.deadline)}
                  </div>
                  <span className={`task-status ${getStatusClass(status)}`}>
                    {status.toUpperCase()}
                  </span>
                </div>

                <div className="task-buttons">
                  <button className="edit" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TaskList;


