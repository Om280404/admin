// src/components/returns/Returns.jsx
import { useEffect, useState } from "react";
import "./Returns.css";
import Sidebar from "../sidebar/Sidebar";

const API_BASE = "http://localhost:5000";

const Returns = () => {
  const [search, setSearch] = useState("");
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { [id]: true }

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/returns`);
      if (!res.ok) throw new Error("Failed to fetch returns");
      const data = await res.json();
      setReturnsList(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  };

  const setBusy = (id, value) => {
    setActionLoading((p) => ({ ...p, [id]: value }));
  };

  const updateLocal = (id, patch) => {
    setReturnsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  /* ============================
     ADMIN APPROVE
  ============================ */
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this return as ADMIN?")) return;
    setBusy(id, true);

    try {
      const res = await fetch(`${API_BASE}/admin/returns/${id}/approve`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Approve failed");

      updateLocal(id, {
        adminApprovalStatus: "APPROVED",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to approve return");
    } finally {
      setBusy(id, false);
    }
  };

  /* ============================
     ADMIN REJECT
  ============================ */
  const handleReject = async (id) => {
    if (!window.confirm("Reject this return as ADMIN?")) return;
    setBusy(id, true);

    try {
      const res = await fetch(`${API_BASE}/admin/returns/${id}/reject`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Reject failed");

      updateLocal(id, {
        adminApprovalStatus: "REJECTED",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to reject return");
    } finally {
      setBusy(id, false);
    }
  };

  /* ============================
     MARK REFUND COMPLETED
  ============================ */
  const handleRefund = async (id) => {
    if (!window.confirm("Mark refund as completed?")) return;
    setBusy(id, true);

    try {
      const res = await fetch(`${API_BASE}/admin/returns/${id}/refund`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Refund failed");

      updateLocal(id, {
        refundStatus: "COMPLETED",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to mark refund");
    } finally {
      setBusy(id, false);
    }
  };

  /* ============================
     FILTER
  ============================ */
  const filtered = returnsList.filter((r) =>
    `${r.id} ${r.productName} ${r.userName} ${r.sellerName} 
     ${r.sellerApprovalStatus} ${r.adminApprovalStatus}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />

      <div className="returns-page">
        {/* HEADER */}
        <div className="returns-header">
          <div>
            <h1>Returns & Refunds</h1>
            <p>Admin approval & refund control</p>
          </div>

          <input
            type="text"
            className="return-search"
            placeholder="Search by id, product, user or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATS */}
        <div className="returns-stats">
          <div className="stat_card">
            <h3>Total</h3>
            <span>{returnsList.length}</span>
          </div>
          <div className="stat_card">
            <h3>Seller Approved</h3>
            <span>
              {returnsList.filter(
                (r) => r.sellerApprovalStatus === "APPROVED"
              ).length}
            </span>
          </div>
          <div className="stat_card">
            <h3>Admin Approved</h3>
            <span>
              {returnsList.filter(
                (r) => r.adminApprovalStatus === "APPROVED"
              ).length}
            </span>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="loading-box">Loading returns…</div>
        ) : (
          <div className="table-scroll">
            <table className="returns-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>User</th>
                  <th>Seller</th>
                  <th>Seller Approval</th>
                  <th>Admin Approval</th>
                  <th>Refund</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => {
                  const fullyApproved =
                    r.sellerApprovalStatus === "APPROVED" &&
                    r.adminApprovalStatus === "APPROVED";

                  return (
                    <tr key={r.id}>
                      <td>#RET-{r.id}</td>
                      <td>{r.productName}</td>
                      <td>{r.userName}</td>
                      <td>{r.sellerName}</td>

                      <td>
                        <span
                          className={`badge ${r.sellerApprovalStatus.toLowerCase()}`}
                        >
                          {r.sellerApprovalStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${r.adminApprovalStatus.toLowerCase()}`}
                        >
                          {r.adminApprovalStatus}
                        </span>
                      </td>

                      <td>
                        ₹{r.refundAmount || 0}{" "}
                        <span
                          className={`badge ${r.refundStatus === "COMPLETED"
                              ? "success"
                              : "pending"
                            }`}
                        >
                          {r.refundStatus || "PENDING"}
                        </span>
                      </td>

                      <td className="actions">
                        {r.adminApprovalStatus === "PENDING" && (
                          <>
                            <button
                              className="success"
                              onClick={() => handleApprove(r.id)}
                              disabled={actionLoading[r.id]}
                            >
                              Approve
                            </button>
                            <button
                              className="danger"
                              onClick={() => handleReject(r.id)}
                              disabled={actionLoading[r.id]}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {fullyApproved &&
                          r.refundStatus !== "COMPLETED" && (
                            <button
                              className="success"
                              onClick={() => handleRefund(r.id)}
                              disabled={actionLoading[r.id]}
                            >
                              Mark Refunded
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">No return requests found</div>
        )}
      </div>
    </>
  );
};

export default Returns;
