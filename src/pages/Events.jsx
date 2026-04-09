import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/events.css";

export default function Events() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [events, setEvents] = useState([]);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});

    // ✅ USER
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/events`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setEvents(res.data);

                // Fetch comments
                res.data.forEach((event) => {
                    fetchComments(event._id);
                });

            } catch (err) {
                console.log("ERROR:", err);
            }
        };

        fetchEvents();
    }, []);

    // ✅ Fetch comments
    const fetchComments = async (eventId) => {
        try {
            const res = await axios.get(`${API_URL}/api/comments/${eventId}`);
            setComments(prev => ({
                ...prev,
                [eventId]: res.data
            }));
        } catch (err) {
            console.log(err);
        }
    };

    // ✅ Add comment
    const handleAddComment = async (eventId) => {
        if (!newComment[eventId]) return;

        try {
            const res = await axios.post(
                `${API_URL}/api/comments`,
                {
                    eventId,
                    text: newComment[eventId]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setComments(prev => ({
                ...prev,
                [eventId]: [...(prev[eventId] || []), res.data]
            }));

            setNewComment(prev => ({
                ...prev,
                [eventId]: ""
            }));

        } catch (err) {
            console.log(err);
        }
    };

    // ✅ DELETE EVENT
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setEvents(events.filter(e => e._id !== id));

        } catch (err) {
            console.log(err);
        }
    };

    // ✅ EDIT EVENT
    const handleEdit = async (id) => {
        const newTitle = prompt("Enter new title");
        if (!newTitle) return;

        try {
            const res = await axios.put(
                `${API_URL}/api/events/${id}`,
                { title: newTitle },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setEvents(events.map(e => e._id === id ? res.data : e));

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="events-wrapper">
            <div className="events-container">

                <h1 className="events-title">All Events</h1>

                {events.length === 0 && <p className="no-events">No events found</p>}

                <div className="events-grid">
                    {events.map((e) => (
                        <div key={e._id} className="event-card">

                            <h2 className="event-title">{e.title}</h2>
                            <p className="event-date">{e.date}</p>

                            <p className="event-meta">
                                Created by: <span>{e.createdBy}</span>
                            </p>

                            <p><b>Type:</b> {e.eventType}</p>
                            <p><b>Venue:</b> {e.venue}</p>

                            {/* ADMIN BUTTONS */}
                            {user?.role === "admin" && (
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(e._id)}>Edit</button>
                                    <button onClick={() => handleDelete(e._id)}>Delete</button>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="event-section">
                                <h3>Timeline</h3>
                                {(e.timeline || []).map((t, i) => (
                                    <p key={i}>• {t.task} @ {t.time}</p>
                                ))}
                            </div>

                            {/* Staff */}
                            <div className="event-section">
                                <h3>Staff</h3>
                                {(e.staffAssignments || []).map((s, i) => (
                                    <p key={i}>• {s.role}: {s.name}</p>
                                ))}
                            </div>

                            {/* COMMENTS */}
                            <div className="event-section">
                                <h3>Comments</h3>

                                {(comments[e._id] || []).length === 0 && (
                                    <p>No comments yet</p>
                                )}

                                {(comments[e._id] || []).map((c, i) => (
                                    <p key={i}>
                                        <b>{c.userName}:</b> {c.text}
                                    </p>
                                ))}

                                <div className="comment-box">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={newComment[e._id] || ""}
                                        onChange={(ev) =>
                                            setNewComment({
                                                ...newComment,
                                                [e._id]: ev.target.value
                                            })
                                        }
                                    />

                                    <button onClick={() => handleAddComment(e._id)}>
                                        Post
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
