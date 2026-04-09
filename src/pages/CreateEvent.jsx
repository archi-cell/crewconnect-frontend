import { useState } from "react";
import axios from "axios";
import "../styles/createevent.css";

export default function CreateEvent() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [data, setData] = useState({
        title: "", clientName: "", createdBy: "",
        date: "", day: "", eventType: "", venue: "",
        timeline: [], staffAssignments: []
    });

    const [task, setTask] = useState({ task: "", time: "" });
    const [staff, setStaff] = useState({ role: "", name: "", time: "" });

    const addTimeline = () => {
        setData({ ...data, timeline: [...data.timeline, task] });
        setTask({ task: "", time: "" });
    };

    const addStaff = () => {
        setData({ ...data, staffAssignments: [...data.staffAssignments, staff] });
        setStaff({ role: "", name: "", time: "" });
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[new Date(selectedDate).getDay()];
        setData({ ...data, date: selectedDate, day: dayName });
    };

    const handleCreate = async () => {
        try {
            await axios.post(
                `${API_URL}/api/events/create`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            alert("Event Created");

        } catch (err) {
            console.log(err);
            alert("Error creating event");
        }
    };

    return (
        <div className="ce-wrapper">
            <div className="ce-container">

                <h1 className="ce-title">Create Event</h1>

                {/* BASIC INFO */}
                <div className="ce-card">
                    <h3>Event Details</h3>

                    <input placeholder="Event Title"
                        onChange={(e) => setData({ ...data, title: e.target.value })} />

                    <input type="date" onChange={handleDateChange} />

                    <select value={data.day}
                        onChange={(e) => setData({ ...data, day: e.target.value })}>
                        <option value="">Select Day</option>
                        <option>Sunday</option>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                    </select>

                    <input placeholder="Event Type"
                        onChange={(e) => setData({ ...data, eventType: e.target.value })} />

                    <input placeholder="Venue"
                        onChange={(e) => setData({ ...data, venue: e.target.value })} />
                </div>

                {/* TIMELINE */}
                <div className="ce-card">
                    <h3>Timeline</h3>

                    <input placeholder="Task"
                        value={task.task}
                        onChange={(e) => setTask({ ...task, task: e.target.value })} />

                    <input placeholder="Time"
                        value={task.time}
                        onChange={(e) => setTask({ ...task, time: e.target.value })} />

                    <button className="ce-btn small" onClick={addTimeline}>
                        Add Timeline
                    </button>

                    {data.timeline.map((t, i) => (
                        <p key={i}>• {t.task} @ {t.time}</p>
                    ))}
                </div>

                {/* STAFF */}
                <div className="ce-card">
                    <h3>Staff Assignments</h3>

                    <input placeholder="Role"
                        value={staff.role}
                        onChange={(e) => setStaff({ ...staff, role: e.target.value })} />

                    <input placeholder="Name"
                        value={staff.name}
                        onChange={(e) => setStaff({ ...staff, name: e.target.value })} />

                    <input placeholder="Time"
                        value={staff.time}
                        onChange={(e) => setStaff({ ...staff, time: e.target.value })} />

                    <button className="ce-btn small" onClick={addStaff}>
                        Add Staff
                    </button>

                    {data.staffAssignments.map((s, i) => (
                        <p key={i}>• {s.role}: {s.name}</p>
                    ))}
                </div>

                {/* FINAL BUTTON */}
                <div className="ce-actions">
                    <button className="ce-btn" onClick={handleCreate}>
                        Create Event
                    </button>
                </div>

            </div>
        </div>
    );
}
