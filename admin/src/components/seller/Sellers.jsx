"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sellers.css";
import Sidebar from "../sidebar/Sidebar";

const Sellers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which ID is being updated

  const fetchSellers = () => {
    fetch("http://localhost:5000/admin/sellers")
      .then((res) => res.json())
      .then((data) => {
        setSellers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // CORRECTED VERIFY HANDLER FOR LIST VIEW
  const handleVerifyToggle = (id, currentStatus) => {
    setActionLoading(id); // Set loading for this specific row
    
    // If status is "VERIFIED", we want to set isVerified to false (revoke)
    const newStatus = currentStatus !== 'VERIFIED';

    fetch(`http://localhost:5000/admin/sellers/${id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: newStatus }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          // Update the specific seller in the list locally to reflect changes immediately
          setSellers((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: data.status } : s))
          );
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        alert("Action failed. Ensure the backend server is running.");
      })
      .finally(() => setActionLoading(null));
  };

  const filteredSellers = sellers.filter((s) =>
    `${s.businessName} ${s.ownerName} ${s.city} ${s.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />

      <div className="sellers-page">
        <div className="sellers-header">
          <div>
            <h1>Sellers</h1>
            <p>Manage sellers & verification</p>
          </div>

          <input
            type="text"
            className="seller-search"
            placeholder="Search name / city / status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">Loading sellers…</div>
        ) : (
          <>
            <div className="table-wrap">
              <div className="table-scroll">
                <table className="sellers-table">
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Owner</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSellers.map((s) => (
                      <tr key={s.id}>
                        <td className="cell-strong">{s.businessName}</td>
                        <td>{s.ownerName}</td>
                        <td>{s.city || "-"}</td>
                        <td>
                          <span className={`status ${s.status.toLowerCase()}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>{new Date(s.joinedAt).toLocaleDateString()}</td>
                        <td className="actions-cell">
                          <button
                            className="btn-view"
                            onClick={() => navigate("/sellerdetails", { state: { sellerId: s.id } })}
                          >
                            View
                          </button>

                          <button
                            className={`btn-verify-small ${s.status === 'VERIFIED' ? 'unverify' : 'verify'}`}
                            onClick={() => handleVerifyToggle(s.id, s.status)}
                            disabled={actionLoading === s.id}
                          >
                            {actionLoading === s.id ? "..." : s.status === 'VERIFIED' ? "Revoke" : "Verify"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredSellers.length === 0 && (
              <div className="empty-state">No sellers found</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Sellers;