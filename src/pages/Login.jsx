import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

// Ambient floating particles
const Particles = () =>
    Array.from({ length: 12 }).map((_, i) => (
        <div
            key={i}
            className="particle"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${40 + Math.random() * 50}%`,
                "--dur": `${7 + Math.random() * 6}s`,
                "--delay": `${Math.random() * 6}s`,
                boxShadow: "0 0 4px 1px rgba(201,168,76,0.5)",
            }}
        />
    ));

export default function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                data
            );

            // ✅ Store token + role + userId
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("userId", res.data.user._id);

            // ✅ Redirect
            if (res.data.role === "admin") {
                window.location.href = "/dashboard";
            } else {
                window.location.href = "/events";
            }

        } catch (err) {
            setError(
                err?.response?.data?.msg || "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="login-wrapper">
            <Particles />

            <div className="login-card">
                <div className="login-eyebrow">Welcome Back</div>

                <h2 className="login-title">
                    Crew<span>Connect</span>
                </h2>

                <div className="login-divider">
                    <div className="login-divider-gem" />
                </div>

                <div className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="login-field">
                        <label className="login-field-label">Email Address</label>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="your@email.com"
                            value={data.email}
                            onChange={(e) =>
                                setData({ ...data, email: e.target.value })
                            }
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-field-label">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                            }
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        className={`login-btn${loading ? " loading" : ""}`}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </div>

                <Link to="/" className="login-back">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}