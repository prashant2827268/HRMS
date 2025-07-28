import React from "react";
import "../css/Dashboard.css";

function Dashboard({ stats }) {
  const defaultStats = {
    totalCandidates: 200,
    totalEmployees: 80,
    pendingLeaves: 7,
    todayAttendance: 55,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div
          className="stat-card"
          style={{ borderTop: "5px solid var(--violet)" }}
        >
          <h3>Total Candidates</h3>
          <p>{displayStats.totalCandidates}</p>
        </div>
        <div
          className="stat-card"
          style={{ borderTop: "5px solid var(--green)" }}
        >
          <h3>Active Employees</h3>
          <p>{displayStats.totalEmployees}</p>
        </div>
        <div
          className="stat-card"
          style={{ borderTop: "5px solid var(--yellow)" }}
        >
          <h3>Pending Leaves</h3>
          <p>{displayStats.pendingLeaves}</p>
        </div>
        <div
          className="stat-card"
          style={{ borderTop: "5px solid var(--red)" }}
        >
          <h3>Today's Attendance</h3>
          <p>{displayStats.todayAttendance}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
