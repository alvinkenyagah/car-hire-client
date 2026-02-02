import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Vehicles from "./pages/Vehicle";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddVehicle from "./pages/admin/AddVehicle";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vehicles" element={<Vehicles />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vehicles/add"
          element={
            <AdminRoute>
              <AddVehicle />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
