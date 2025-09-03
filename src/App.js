import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

// Pages se import
import Navbar from "./Pages/Navbar";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import MyAppointments from "./Pages/MyAppointments";
import BookingPage from "./Pages/BookingPage";
import AdminBookings from "./AdminPanel/AllBookings";

// Protected Route Component for role-based access
function ProtectedRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If admin tries to access user pages, redirect to admin panel
    if (user.role === "admin") {
      return <Navigate to="/admin/allbookings" replace />;
    }
    // If user tries to access admin pages, redirect to home
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Navbar ko condition ke sath wrap karne ke liye ek component banate hain
function Layout() {
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  // Jahan Navbar nahi dikhana hai
  const hideNavbarPaths = ["/login", "/register"];

  return (
    <div className="App">
      {/* Agar current path hideNavbarPaths me nahi hai to Navbar show hoga */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/my-appointments" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyAppointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/allbookings" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            token ? (
              <ProtectedRoute allowedRoles={["user"]}>
                <BookingPage />
              </ProtectedRoute>
            ) : (
              <Login />
            )
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
