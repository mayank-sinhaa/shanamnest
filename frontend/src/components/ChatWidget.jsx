import { useState } from "react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "Support Team",
      text: "Hello! Please share your query. Our team will guide you as soon as possible.",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSend = () => {
    if (!formData.message.trim()) {
      return;
    }

    setMessages([
      ...messages,
      {
        from: formData.name.trim() || "Visitor",
        text: formData.message,
      },
      {
        from: "Support Team",
        text: "Thank you for contacting ANAM FOUNDATION. Your message has been received. Our team will respond soon.",
      },
    ]);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <>
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div>
              <h3>ANAM FOUNDATION Support</h3>
              <p>Offline helpdesk available</p>
            </div>

            <button type="button" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-body">
            <div className="chat-messages">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={
                    item.from === "Support Team"
                      ? "chat-message support"
                      : "chat-message visitor"
                  }
                >
                  <strong>{item.from}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <form className="chat-form">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>

              <button type="button" onClick={handleSend}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "Chat"}
      </button>
    </>
  );
}