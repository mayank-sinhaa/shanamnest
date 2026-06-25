import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ANAM <span>FOUNDATION</span>
          </Link>

          <p>
            A caring digital platform for newborn families, member support,
            grievance tracking and secure communication.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3>Member Portal</h3>

          <div className="footer-links">
            <Link to="/login">Member Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/live-chat">Schedule Live Chat</Link>
          </div>
        </div>

        <div>
          <h3>Contact</h3>

          <div className="footer-contact">
            <p>Email: support@shanamnest.org</p>
            <p>Phone: +91 98765 43210</p>
            <p>Service Area: India</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ANAM FOUNDATION. All rights reserved.</p>
        <p>Designed for newborn family support and grievance management.</p>
      </div>
    </footer>
  );
}