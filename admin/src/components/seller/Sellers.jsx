import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sellers.css";
import Sidebar from "../sidebar/Sidebar";

const Sellers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const filteredSellers = sellers.filter((s) =>
    `${s.businessName} ${s.city} ${s.status}`
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
          <p>Loading sellers...</p>
        ) : (
          <>
            <table className="sellers-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Owner</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {filteredSellers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.businessName}</td>
                    <td>{s.ownerName}</td>
                    <td>{s.city}</td>
                    <td>
                      <span className={`status ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{new Date(s.joinedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() =>
                          navigate("/sellerdetails", {
                            state: { sellerId: s.id },
                          })
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
