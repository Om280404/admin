import { useEffect, useState } from "react";
import "./ContactMessages.css";
import Sidebar from "../sidebar/Sidebar";

const ContactMessages = () => {
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);

  /* =========================
     FETCH FROM BACKEND
  ========================= */
  useEffect(() => {
    fetch("http://localhost:5000/admin/contact-messages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      })
      .then(setMessages)
      .catch((err) => console.error(err));
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.email} ${m.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />

      <div className="contact-page">
        {/* Header */}
        <div className="contact-header">
          <div>
            <h1>Contact Messages</h1>
            <p>User enquiries from contact form</p>
          </div>

          <input
            type="text"
            className="contact-search"
            placeholder="Search name, email or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="contact-stats">
          <div className="stat-card">
            <h3>Total Messages</h3>
            <span>{messages.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="table-scroll">

          <table className="contact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.map((m) => (
                <MessageRow key={m.id} message={m} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="empty-state">No messages found</div>
        )}
      </div>
    </>
  );
};

export default ContactMessages;

/* =========================
   MESSAGE ROW
========================= */

const MessageRow = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = message.message.length > 120;

  return (
    <tr>
      <td>{message.name}</td>
      <td>{message.email}</td>
      <td className="message-cell">
        <p className={`message-text ${expanded ? "expanded" : ""}`}>
          {message.message}
        </p>

        {isLong && (
          <button
            type="button"
            className="read-more"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </td>
      <td>{new Date(message.createdAt).toLocaleDateString()}</td>
    </tr>
  );
};
