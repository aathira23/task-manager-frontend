import React, { useState, useEffect } from "react";
import axios from "../api";
import { FiCalendar, FiClock } from "react-icons/fi";

function AddTaskForm({ onTaskAdded, taskToEdit }) {
  const [form, setForm] = useState({
    title: "",
    category: "Work",
    deadlineDate: "",
    deadlineTime: "",
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (taskToEdit) {
      const deadline = new Date(taskToEdit.deadline);
      const dateStr = deadline.toISOString().split("T")[0];
      const timeStr = deadline.toTimeString().slice(0, 5);
      setForm({
        title: taskToEdit.title,
        category: taskToEdit.category,
        deadlineDate: dateStr,
        deadlineTime: timeStr,
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { deadlineDate, deadlineTime, ...rest } = form;
    const deadline = `${deadlineDate}T${deadlineTime}`;

    try {
      if (taskToEdit) {
        // PATCH if editing
        await axios.patch(`/tasks/${taskToEdit.id}`, {
          ...rest,
          deadline,
        });
      } else {
        // POST if adding
        await axios.post("/tasks", {
          ...rest,
          deadline,
          status: "PENDING",
        });
      }

      onTaskAdded(); // Refresh list and close form
      setForm({
        title: "",
        category: "Work",
        deadlineDate: "",
        deadlineTime: "",
      });
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Category:
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option>Work</option>
          <option>Personal</option>
          <option>Others</option>
        </select>
      </label>

      <label>
        Deadline:
        <div className="deadline-field">
          <div className="deadline-input-wrapper">
            <span className="input-icon">
              <FiCalendar />
            </span>
            <input
              type="date"
              name="deadlineDate"
              value={form.deadlineDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="deadline-input-wrapper">
            <span className="input-icon">
              <FiClock />
            </span>
            <input
              type="time"
              name="deadlineTime"
              value={form.deadlineTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </label>

      <div className="save-button-container">
        <button type="submit">{taskToEdit ? "Update" : "Save"}</button>
      </div>
    </form>
  );
}

export default AddTaskForm;









