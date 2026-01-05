import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Sidebar.css";

const Brand = ({ children }) => <span className="brand">{children}</span>;

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger-btn" onClick={() => setOpen(true)}>
        <FaBars />
      </button>

      {/* Backdrop */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            <Brand>Core2Cover</Brand>
          </h2>

          <button className="close-btn" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav" onClick={() => setOpen(false)}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/sellers">Sellers</NavLink>
          <NavLink to="/designers">Designers</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/returns">Returns</NavLink>
          <NavLink to="/contactmessages">Contact Messages</NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
