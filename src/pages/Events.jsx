import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/events.css";   // ← only change

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/events`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                console.log("EVENTS:", res.data);
                setEvents(res.data);

            } catch (err) {
                console.log("ERROR:", err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            {events.length === 0 && <p>No events found</p>}

            {events.map((e) => (
                <div key={e._id} style={{ border: "1px solid gray", margin: "20px", padding: "15px" }}>

                    <h2>{e.title}</h2>
                    <p><b>{e.date}</b></p>
                    <p>Created by: {e.createdBy}</p>

                    <p><b>Type:</b> {e.eventType}</p>
                    <p><b>Venue:</b> {e.venue}</p>

                    <h3>Timeline</h3>
                    {(e.timeline || []).map((t, i) => (
                        <p key={i}>- {t.task} @ {t.time}</p>
                    ))}

                    <h3>Staff Assignments</h3>
                    {(e.staffAssignments || []).map((s, i) => (
                        <p key={i}>- {s.role}: {s.name} @ {s.time}</p>
                    ))}
                </div>
            ))}
        </div>
    );
}