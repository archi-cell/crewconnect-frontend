import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

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

// Password strength — returns 0–4
const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
};

const strengthLabel = ["", "Weak", "Fair", "Strong", "Excellent"];
const strengthClass = ["", "active-weak", "active-fair", "active-strong", "active-great"];

export default function Register() {
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const strength = getStrength(data.password);

    const handleRegister = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                data
            );

            setSuccess("Account created successfully. Redirecting…");
            setTimeout(() => navigate("/login"), 1400);

        } catch (err) {
            setError(
                err?.response?.data?.message || "Error registering. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <div className="register-wrapper">
            <Particles />

            <div className="register-card">
                {/* Eyebrow */}
                <div className="register-eyebrow">Create Account</div>

                {/* Title */}
                <h2 className="register-title">
                    Crew<span>Connect</span>
                </h2>

                {/* Divider */}
                <div className="register-divider">
                    <div className="register-divider-gem" />
                </div>

                {/* Form */}
                <div className="register-form">
                    {error && <div className="register-error">{error}</div>}
                    {success && <div className="register-success">{success}</div>}

                    {/* Name */}
                    <div className="register-field">
                        <label className="register-field-label">Full Name</label>
                        <input
                            className="register-input"
                            type="text"
                            placeholder="John Doe"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Email */}
                    <div className="register-field">
                        <label className="register-field-label">Email Address</label>
                        <input
                            className="register-input"
                            type="email"
                            placeholder="your@email.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Password */}
                    <div className="register-field">
                        <label className="register-field-label">
                            Password
                            {data.password && (
                                <span style={{
                                    float: "right",
                                    color: strength === 1 ? "#c0614a" : strength === 2 ? "#c9943a" : strength >= 3 ? "var(--gold)" : "transparent",
                                    fontStyle: "italic",
                                    letterSpacing: "0.15em"
                                }}>
                                    {strengthLabel[strength]}
                                </span>
                            )}
                        </label>
                        <input
                            className="register-input"
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            onKeyDown={handleKeyDown}
                        />
                        {/* Strength bar */}
                        <div className="register-strength">
                            {[1, 2, 3, 4].map((seg) => (
                                <div
                                    key={seg}
                                    className={`register-strength-segment ${strength >= seg ? strengthClass[strength] : ""}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        className={`register-btn${loading ? " loading" : ""}`}
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? "Creating Account…" : "Register"}
                    </button>
                </div>

                {/* Back link */}
                <Link to="/login" className="register-back">
                    Already have an account? Login
                </Link>
            </div>
        </div>
    );
}