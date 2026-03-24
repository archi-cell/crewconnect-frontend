import { useState } from "react";
import axios from "axios";
import "../styles/createEvent.css";

export default function CreateEvent() {
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
                `${import.meta.env.VITE_API_URL}/api/events/create`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            alert("Event Created");
        } catch (err) {
            console.log("CREATE EVENT ERROR:", err);
            alert("Error creating event");
        }
    };

    return (
        /* ✅ Only change from original: className="ce-page" */
        <div className="ce-page">
            <h2>Create Event</h2>

            <label>Event Name</label>
            <input placeholder="Event Title" onChange={(e) => setData({ ...data, title: e.target.value })} />

            <label>Select Date:</label>
            <input type="date" onChange={handleDateChange} />

            <label>Select Day:</label>
            <select value={data.day} onChange={(e) => setData({ ...data, day: e.target.value })}>
                <option value="">Select Day</option>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
            </select>

            <label>Event Type</label>
            <input placeholder="Event Type" onChange={(e) => setData({ ...data, eventType: e.target.value })} />
            <label>Venue</label>
            <input placeholder="Venue" onChange={(e) => setData({ ...data, venue: e.target.value })} />

            <h3>Timeline</h3>
            <label>Task</label>
            <input placeholder="Task" value={task.task} onChange={(e) => setTask({ ...task, task: e.target.value })} />
            <label>Time</label>
            <input placeholder="Time" value={task.time} onChange={(e) => setTask({ ...task, time: e.target.value })} />
            <button onClick={addTimeline}>Add Timeline</button>

            <h3>Staff Assignments</h3>
            <label>Role</label>
            <input placeholder="Role" value={staff.role} onChange={(e) => setStaff({ ...staff, role: e.target.value })} />
            <label>Name</label>
            <input placeholder="Name" value={staff.name} onChange={(e) => setStaff({ ...staff, name: e.target.value })} />
            <label>Time</label>
            <input placeholder="Time" value={staff.time} onChange={(e) => setStaff({ ...staff, time: e.target.value })} />
            <button onClick={addStaff}>Add Staff</button>

            <button onClick={handleCreate}>Create Event</button>
        </div>
    );
}