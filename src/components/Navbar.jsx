import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../socket";
import "../styles/navbar.css";

export default function Navbar() {
    const role = localStorage.getItem("role");

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // 🔔 Listen for new comment
        socket.on("new_comment", (data) => {
            setNotifications(prev => [data.message, ...prev]);
        });

        // 🔔 Listen for new event
        socket.on("new_event", (data) => {
            setNotifications(prev => [data.message, ...prev]);
        });

        // ✅ Cleanup (VERY IMPORTANT)
        return () => {
            socket.off("new_comment");
            socket.off("new_event");
        };
    }, []);

    return (
        <div className="nav-wrapper">
            <nav className="nav-container">

                <h2 className="nav-logo">
                    Crew<span>Connect</span>
                </h2>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/chat">Chat</Link>

                    {role === "admin" && (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/create-event">Create Event</Link>
                        </>
                    )}

                    {/* 🔔 NOTIFICATION ICON */}
                    <div className="notification-wrapper">
                        <span
                            className="bell"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            🔔
                            {notifications.length > 0 && (
                                <span className="badge">
                                    {notifications.length}
                                </span>
                            )}
                        </span>

                        {/* 🔽 DROPDOWN */}
                        {showDropdown && (
                            <div className="notification-dropdown">
                                {notifications.length === 0 ? (
                                    <p>No notifications</p>
                                ) : (
                                    notifications.map((n, i) => (
                                        <p key={i}>{n}</p>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                </div>

            </nav>
        </div>
    );
}
