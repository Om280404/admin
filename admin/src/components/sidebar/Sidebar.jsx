import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Brand = ({ children }) => <span className="brand">{children}</span>;
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo"><Brand>Core2Cover</Brand></h2>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/sellers">Sellers</NavLink>
        <NavLink to="/designers">Designers</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/returns">Returns</NavLink>
        <NavLink to="/contactmessages">Contact Messages</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
