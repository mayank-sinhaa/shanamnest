import "./HomePage.css";

const services = [
  {
    title: "Newborn Care Support",
    desc: "Warm, reliable guidance and care support for families during the most important early days.",
  },
  {
    title: "Family Member Portal",
    desc: "Registered members can access their dashboard, profile, updates, and support services.",
  },
  {
    title: "Grievance Assistance",
    desc: "Raise concerns, track status, and receive replies from the support team in one place.",
  },
];

const stats = [
  { number: "24/7", label: "Support Focus" },
  { number: "100%", label: "Family-Centered Care" },
  { number: "Secure", label: "Member Portal" },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">ANAM FOUNDATION Newborn Care Platform</p>

          <h1>
            Caring Hands for <span>Newborns</span> and Families
          </h1>

          <p className="hero-text">
            A warm, trusted and professional member portal designed for newborn
            care support, family communication, grievances, and service guidance.
          </p>

          <div className="hero-actions">
            <a href="/register" className="btn btn-primary">
              Become a Member
            </a>

            <a href="/login" className="btn btn-secondary">
              Member Login
            </a>

            <a href="/admin-login" className="btn btn-secondary">
              Admin Login
            </a>
          </div>

          <div className="hero-stats">
            {stats.map((item, index) => (
              <div className="stat-card" key={index}>
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="section-heading">
          <p>Our Mission</p>
          <h2>Supporting families with care, clarity and trust</h2>
        </div>

        <div className="intro-grid">
          <div className="intro-card">
            <h3>For Families</h3>
            <p>
              Members can manage their profile, access dashboard updates, and
              communicate with the organization easily.
            </p>
          </div>

          <div className="intro-card highlighted">
            <h3>For Support</h3>
            <p>
              A structured grievance system helps families submit concerns,
              track status, and receive timely replies.
            </p>
          </div>

          <div className="intro-card">
            <h3>For Staff</h3>
            <p>
              Admin and staff can manage users, grievances, replies, categories,
              service content, and communication workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <p>What We Provide</p>
          <h2>Professional care services built around newborn families</h2>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={index}>
              <div className="service-icon">{index + 1}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <a href="/services">Learn More →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="portal-section">
        <div className="portal-content">
          <p className="eyebrow">Member & Grievance Portal</p>

          <h2>Everything your members need, in one secure place</h2>

          <p>
            ANAM FOUNDATION brings public information, member access, grievance
            submission, support replies, and admin management into one clean
            platform.
          </p>

          <div className="portal-actions">
            <a href="/login" className="btn btn-primary">
              Open Member Portal
            </a>

            <a href="/admin-login" className="btn btn-outline">
              Admin Login
            </a>
          </div>
        </div>

        <div className="portal-card">
          <div className="portal-card-header">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="portal-list">
            <div>
              <strong>Profile Management</strong>
              <p>Update member details and profile photo</p>
            </div>

            <div>
              <strong>Grievance Tracking</strong>
              <p>Pending → In Progress → Resolved</p>
            </div>

            <div>
              <strong>Admin Replies</strong>
              <p>Thread-based communication with support staff</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to create a caring digital experience?</h2>

        <p>
          Join ANAM FOUNDATION as a member and stay connected with support, services,
          and assistance.
        </p>

        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <a href="/register" className="btn btn-light">
            Register Now
          </a>

          <a href="/login" className="btn btn-secondary">
            Member Login
          </a>

          <a href="/admin-login" className="btn btn-secondary">
            Admin Login
          </a>
        </div>
      </section>
    </main>
  );
}