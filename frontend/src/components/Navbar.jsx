import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Shanam<span>Nest</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/live-chat">Live Chat</Link>
        <Link to="/login">Member Login</Link>
        <Link to="/register" className="nav-btn">
          Register
        </Link>
      </div>
    </nav>
  );
}