import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import Chat from "./pages/Chat";



function App() {
  return (
    <BrowserRouter>
      {/* 
        Outer wrapper — full screen, dark background
        display:block is default for div — Navbar stacks ABOVE Routes 
      */}
      <div style={{
        background: "#080b0f",
        minHeight: "100vh",
        width: "100vw",
        display: "block",   /* ← explicit block — no flex side-by-side */
        margin: 0,
        padding: 0,
        overflowX: "hidden"
      }}>

        {/* Navbar — renders full width block on top */}
        <Navbar />

        {/* 
          Page wrapper — full width below navbar
          This div centers page content 
        */}
        <div style={{
          width: "100%",
          background: "#080b0f",
          display: "block"
        }}>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events"   element={<Events />} />
            <Route path="/chat" element={<Chat />} />

            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/create-event"
              element={
                <AdminRoute>
                  <CreateEvent />
                </AdminRoute>
              }
            />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
