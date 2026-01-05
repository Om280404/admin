import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ FIX
import "./UserDetails.css";
import Sidebar from "../sidebar/Sidebar";

const UserDetails = () => {
  const { id } = useParams(); // ✅ works now

  const [user, setUser] = useState(null); // ✅ MISSING STATE
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH USER DETAILS
  ====================== */
  useEffect(() => {
    fetch(`http://localhost:5000/admin/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  /* ======================
     LOADING GUARD
  ====================== */
  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="user-details-page">
          <p>Loading user details...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Sidebar />
        <div className="user-details-page">
          <p>User not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="user-details-page">
        {/* Header */}
        <div className="user-header">
          <h1>{user.name}</h1>
        </div>

        {/* Profile */}
        <div className="user-profile">
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "-"}</p>
          </div>

          <div>
            <p><strong>Address:</strong> {user.address || "-"}</p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(user.createdAt).toDateString()}
            </p>
            <p><strong>Credit Balance:</strong> ₹{user.credit}</p>
          </div>
        </div>

        {/* Orders */}
        <section className="section">
          <h2>Orders</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((o) => (
                <tr key={o.id}>
                  <td>#ORD-{o.id}</td>
                  <td>₹{o.grandTotal}</td>
                  <td>{o.paymentMethod}</td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Return Requests */}
        <section className="section">
          <h2>Return Requests</h2>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {user.returnRequests.map((r) => (
                <tr key={r.id}>
                  <td>#RR-{r.id}</td>
                  <td>{r.productName}</td>
                  <td>{r.reason}</td>
                  <td>
                    <span className="badge warning">{r.status}</span>
                  </td>
                  <td>
                    {new Date(r.requestedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default UserDetails;
