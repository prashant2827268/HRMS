import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../css/Layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <Header />
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
