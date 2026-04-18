import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import { Toaster } from 'react-hot-toast';
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Projects from "./pages/Projects";
import Request from "./pages/Request";
import RequestAdmin from "./pages/RequestAdmin";

import History from "./pages/History";
import Profile from "./pages/Profile";
import ReportIssue from "./pages/ReportIssue";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Layout from "./components/Layout";

function App() {
  const { user } = useContext(AppContext);

  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* 🔐 PROTECTED ROUTES */}

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user ? <Layout><Dashboard /></Layout> : <Login />
          }
        />

        {/* INVENTORY (ADMIN ONLY) */}
        <Route
          path="/inventory"
          element={
            user ? <Layout><Inventory /></Layout> : <Login />
          }
        />

        {/* PROJECTS */}
        <Route
          path="/projects"
          element={
            user ? <Layout><Projects /></Layout> : <Login />
          }
        />

        {/* STUDENT REQUEST */}
        <Route
          path="/request"
          element={
            (user?.role?.toLowerCase() === "student" || user?.role?.toLowerCase() === "user")
              ? <Layout><Request /></Layout>
              : <Login />
          }
        />

        {/* ADMIN REQUEST MANAGEMENT */}
        <Route
          path="/manage-requests"
          element={
            user?.role?.toLowerCase() === "admin"
              ? <Layout><RequestAdmin /></Layout>
              : <Login />
          }
        />

        {/* ✅ NEW STUDENT PAGES */}

        <Route
          path="/history"
          element={
            (user?.role?.toLowerCase() === "student" || user?.role?.toLowerCase() === "user")
              ? <Layout><History /></Layout>
              : <Login />
          }
        />

        <Route
          path="/report-issue"
          element={
            (user?.role?.toLowerCase() === "student" || user?.role?.toLowerCase() === "user")
              ? <Layout><ReportIssue /></Layout>
              : <Login />
          }
        />

        <Route
          path="/profile"
          element={
            user
              ? <Layout><Profile /></Layout>
              : <Login />
          }
        />

        {/* ✅ NEW ADMIN PAGES */}

        <Route
          path="/reports"
          element={
            user?.role?.toLowerCase() === "admin"
              ? <Layout><Reports /></Layout>
              : <Login />
          }
        />

        <Route
          path="/settings"
          element={
            user?.role?.toLowerCase() === "admin"
              ? <Layout><Settings /></Layout>
              : <Login />
          }
        />
       
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </Router>
  );
}

export default App;