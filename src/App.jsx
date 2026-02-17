import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Vehicles from "./pages/Vehicle";
import ProfilePage from "./pages/Profile.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddVehicle from "./pages/admin/AddVehicle";
import AdminRoute from "./components/AdminRoute";
import VehicleDetail from "./pages/VehicleDetail.jsx";
import AdminHires from "./pages/admin/AdminHires.jsx";
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
         <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/profile" element={<ProfilePage />} />


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
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/hires"
          element={
            <AdminRoute>
              <AdminHires />
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
