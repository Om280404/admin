import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";
import Sidebar from "../sidebar/Sidebar";

const Users = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]); // ✅ MISSING STATE
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH USERS
  ====================== */
  useEffect(() => {
    fetch("http://localhost:5000/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* ======================
     SEARCH FILTER
  ====================== */
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="users-page">
          <p>Loading users...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="users-page">
        <div className="users-header">
          <div>
            <h1>Users</h1>
            <p>Registered customers</p>
          </div>

          <input
            type="text"
            className="user-search"
            placeholder="Search name / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Credit</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>
                  <td>₹{user.credit}</td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">No users found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
