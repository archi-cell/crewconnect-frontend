import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

export default function Dashboard() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [stats, setStats] = useState({
        totalEvents: 0,
        totalUsers: 0,
        assignedCount: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/events/stats/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                console.log("STATS:", res.data);
                setStats(res.data);
            } catch (err) {
                console.log("ERROR:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <h3>Loading Dashboard...</h3>;
    if (error) return <h3>{error}</h3>;

    return (
        <div className="dash-wrapper">
            <div className="dash-container">

                <h1 className="dash-title">Admin Dashboard</h1>

                <div className="dash-grid">
                    <div className="dash-card">
                        <h3>Total Events</h3>
                        <p>{stats.totalEvents || 0}</p>
                    </div>

                    <div className="dash-card">
                        <h3>Total Users</h3>
                        <p>{stats.totalUsers || 0}</p>
                    </div>

                    <div className="dash-card">
                        <h3>Assigned Staff</h3>
                        <p>{stats.assignedCount || 0}</p>
                    </div>
                </div>

                <div className="dash-actions">
                    <a href="/create-event">
                        <button className="dash-btn">Create Event</button>
                    </a>
                </div>

            </div>
        </div>
    );
}

// (Optional styles if used somewhere else)
const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    width: "150px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const btnStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer"
};
