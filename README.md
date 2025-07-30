# Task Manager – Frontend
This is the frontend of the Task Manager app, built using **React**.

## File Structure & Components
- **App.js**: Main layout, state management, and routing of components.
- **AddTaskForm.js**: Controlled form for creating/editing tasks.
- **TaskList.js**: Renders task cards with status, edit, delete, and toggle logic.
- **api.js**: Axios setup for making backend requests.
- **index.css**: Centralized styling including **light/dark mode** and responsiveness.

## UI Flow
- App header with title and a **theme toggle** button (light/dark).
- `+ Add Task` button opens a form to:
  - Enter task title
  - Select category (Work, Personal, Others)
  - Pick deadline (date & time)
- Submitted tasks appear in a filtered list with:
  - **Title, category, deadline, and status** (Pending, Completed, or Failed)
  - Status auto-updates based on checkbox and deadline
  - Edit and Delete buttons (Edit pre-fills the form, Delete asks confirmation)

## Filtering & Interaction
- Filter tasks by category
- Toggle task status
- Responsive design – mobile-friendly

## Backend Integration
- Communicates with Spring Boot backend via Axios.
- Make sure backend is running and accessible via the correct API URL.
  
## Tech Stack
- **React**
- **Axios**
- **CSS**
