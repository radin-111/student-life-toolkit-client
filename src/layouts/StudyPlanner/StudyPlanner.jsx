import React, { useState } from "react";

import KanbanBoard from "./KanbanBoard";
import ProgressDashboard from "./ProgressDashboard";
import CalendarView from "./CalendarView";
import AddTaskForm from "./AddTaskForm";

const StudyPlanner = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📚 Study Planner Dashboard
      </h1>

      {/* Tabs */}
      <div className="tabs tabs-boxed justify-center mb-6 gap-2 ">
        <button
          className={`btn  ${
            activeTab === "add" ? "btn-primary" : "btn-soft btn-primary"
          }`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add Task
        </button>
        <button
          className={`btn ${
            activeTab === "kanban" ? "btn-primary" : "btn-soft btn-primary"
          }`}
          onClick={() => setActiveTab("kanban")}
        >
          📌 Kanban Board
        </button>
        <button
          className={`btn ${
            activeTab === "progress" ? "btn-primary" : "btn-soft btn-primary "
          }`}
          onClick={() => setActiveTab("progress")}
        >
          📈 Progress
        </button>
        <button
          className={`btn ${
            activeTab === "calendar" ? " btn-primary " : "btn-soft btn-primary "
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          📅 Calendar
        </button>
      </div>

      {/* Content */}
      <div className="bg-base-100 p-4 rounded-xl shadow">
        {activeTab === "add" && <AddTaskForm />}
        {activeTab === "kanban" && <KanbanBoard />}
        {activeTab === "progress" && <ProgressDashboard />}
        {activeTab === "calendar" && <CalendarView />}
      </div>
    </div>
  );
};

export default StudyPlanner;
