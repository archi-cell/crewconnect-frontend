import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    const role = localStorage.getItem("role");

    return (
        <div style={{
            width: "100%",
            display: "block",
            position: "sticky",
            top: 0,
            zIndex: 200,
            background: "#080b0f"
        }}>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/events">Events</Link>

                {/* ✅ Chat visible to both */}
                <Link to="/chat">Chat</Link>

                {role === "admin" && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/create-event">Create Event</Link>
                    </>
                )}
            </nav>
        </div>
    );
}
