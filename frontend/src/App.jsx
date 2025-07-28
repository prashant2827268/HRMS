import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useAuth } from "./context/authContext";

import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import LeavesPage from "./pages/Leaves";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import "./App.css";

const AppRoutes = () => {
  const { isAuthenticated, handleLogin } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/candidates" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<LeavesPage />} />
        <Route path="*" element={<Navigate to="/candidates" />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // transition={Bounce}
      />
    </>
  );
};

export default App;
