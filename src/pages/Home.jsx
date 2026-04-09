import { Link } from "react-router-dom";
import "../styles/home.css"

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

export default function Home() {
    return (
        <div className="home-wrapper">
            <Particles />

            <div className="home-card">
                {/* Eyebrow */}
                <div className="home-eyebrow">Est. 2025</div>

                {/* Brand */}
                <h1 className="home-title">
                    Crew<span>Connect</span>
                </h1>

                {/* Decorative divider */}
                <div className="home-divider">
                    <div className="home-divider-gem" />
                </div>

                {/* Tagline */}
                <p className="home-subtitle">Manage Events &amp; Staff Seamlessly</p>

                {/* CTA Buttons */}
                <div className="home-actions">
                    <Link to="/login">
                        <button className="btn btn-primary">Login</button>
                    </Link>
                    <Link to="/register">
                        <button className="btn btn-secondary">Register</button>
                    </Link>
                </div>

                {/* Footer note */}
                <p className="home-footer-note">Secure &nbsp;·&nbsp; Reliable &nbsp;·&nbsp; Premium</p>
            </div>
        </div>
    );
}
