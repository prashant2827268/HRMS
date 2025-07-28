import React from "react";
import { FiMail, FiBell, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../css/Header.css";

function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const getPageName = () => {
    const path = location.pathname;
    if (path.includes("/candidates")) {
      return "Candidates";
    } else if (path.includes("/employees")) {
      return "Employees";
    } else if (path.includes("/attendance")) {
      return "Attendance";
    } else if (path.includes("/leaves")) {
      return "Leaves";
    } else if (path.includes("/dashboard")) {
      return "Dashboard";
    }
    return "Candidates";
  };

  const pageName = getPageName();

  // Get the display name from user data
  const getDisplayName = () => {
    if (user) {
      return user.name || user.username || "User";
    }
    return "User";
  };

  return (
    <div className="header-container">
      {/* Page Name */}
      <h1 className="header-title">{pageName}</h1>

      {/* Right-aligned icons and profile */}
      <div className="header-icons">
        <button className="header-icon-btn">
          <FiMail size={20} />
        </button>
        <button className="header-icon-btn">
          <FiBell size={20} />
        </button>
        <div className="header-profile">
          <img
            src="https://i.pravatar.cc/300?img=1"
            alt="User"
            className="header-profile-img"
          />
          <span className="header-username">{getDisplayName()}</span>
          <button className="header-icon-btn">
            <FiUser size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
