import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../styles/chat.css";

const socket = io(import.meta.env.VITE_API_URL);

export default function Chat() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const myId = role === "admin" ? "admin" : localStorage.getItem("userId");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/chat-users`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(res.data);
            } catch (err) {
                console.log("USER FETCH ERROR:", err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        const roomId = [myId, selectedUser._id].sort().join("_");
        socket.emit("joinRoom", roomId);

        axios
            .get(`${import.meta.env.VITE_API_URL}/api/chat/${roomId}`)
            .then((res) => setMessages(res.data))
            .catch((err) => console.log("CHAT LOAD ERROR:", err));

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => { socket.off("receiveMessage"); };
    }, [selectedUser]);

    // ✅ SEND MESSAGE
    const sendMessage = () => {
        if (!message || !selectedUser) return;

        const roomId = [myId, selectedUser._id].sort().join("_");
        const data = { senderId: myId, receiverId: selectedUser._id, message, roomId };
        socket.emit("sendMessage", data);
        setMessage("");
    };

    // Send on Enter key
    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        /* ✅ className="chat-page" — overrides inline style */
        <div className="chat-page" style={{ display: "flex", height: "90vh" }}>

            {/* ── SIDEBAR ── */}
            <div className="chat-sidebar" style={{ width: "30%", borderRight: "1px solid gray", padding: "10px" }}>
                <h3>Chats</h3>

                {users.length === 0 && <p>No users found</p>}

                {users.map((u) => (
                    <div
                        key={u._id}
                        onClick={() => setSelectedUser(u)}
                        className={`chat-user-item ${selectedUser?._id === u._id ? "active" : ""}`}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            background: selectedUser?._id === u._id ? "#222" : "transparent"
                        }}
                    >
                        {/* name & email stay exactly as original */}
                        {u.name} <br />
                        <small>{u.email}</small>
                    </div>
                ))}
            </div>

            {/* ── CHAT AREA ── */}
            <div className="chat-area" style={{ width: "70%", padding: "10px" }}>
                {selectedUser ? (
                    <>
                        <h3>Chat with {selectedUser.name}</h3>

                        {/* Messages list */}
                        <div
                            className="chat-messages"
                            style={{
                                height: "350px",
                                overflowY: "scroll",
                                border: "1px solid gray",
                                padding: "10px",
                                marginBottom: "10px"
                            }}
                        >
                            {messages.map((m, i) => {
                                const isMe = m.senderId === myId;
                                return (
                                    /* ✅ msg-me / msg-them class for alignment */
                                    <p key={i} className={isMe ? "msg-me" : "msg-them"}>
                                        <b>{isMe ? "Me" : selectedUser.name}</b>
                                        {/* bubble wrapper for styling */}
                                        <span className="bubble">{m.message}</span>
                                    </p>
                                );
                            })}
                        </div>

                        {/* Input row */}
                        <div className="chat-input-row">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type message..."
                                style={{ width: "70%", padding: "8px" }}
                            />
                            <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Select a user to start chatting</p>
                )}
            </div>

        </div>
    );
}
