import React from "react";
import { FiUsers, FiLogOut, FiSearch } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineAccessTime, MdOutlineEventNote } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../css/Sidebar.css";

const menuItems = [
  {
    section: "Recruitment",
    items: [
      { name: "Candidates", icon: <FiUsers />, path: "/candidates" },
    ],
  },
  {
    section: "Organization",
    items: [
      { name: "Employees", icon: <FaUserTie />, path: "/employees" },
      {
        name: "Attendance",
        icon: <MdOutlineAccessTime />,
        path: "/attendance",
      },
      {
        name: "Leaves",
        icon: <MdOutlineEventNote />,
        path: "/leaves",
      },
    ],
  },
  {
    section: "Others",
    items: [{ name: "Logout", icon: <FiLogOut />, path: "/logout", isLogout: true }],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  const handleItemClick = (item) => {
    if (item.isLogout) {
      handleLogout();
      navigate("/login");
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="sidebar-container">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon"></span>
        <h1 className="sidebar-logo-text">LOGO</h1>
      </div>

      {/* Search Box */}
      <div className="sidebar-search-box">
        <FiSearch className="sidebar-search-icon" />
        <input
          type="text"
          placeholder="Search"
          className="sidebar-search-input"
        />
      </div>

      {/* Menu Sections */}
      <div className="sidebar-menu">
        {menuItems.map((section) => (
          <div key={section.section} className="sidebar-section">
            <p className="sidebar-section-title">{section.section}</p>
            <ul className="sidebar-list">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li
                    key={item.name}
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
