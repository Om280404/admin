import { useEffect, useState } from "react";
import "./Designers.css";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router-dom";


const Designers = () => {
  const [search, setSearch] = useState("");
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/designers");
        const data = await res.json();
        setDesigners(data);
      } catch (err) {
        console.error("Failed to load designers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigners();
  }, []);

  const filteredDesigners = designers.filter((d) =>
    `${d.fullname || ""} ${d.location || ""} ${d.availability || ""} ${d.status || ""} ${d.subscriptionStatus || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <>
      <Sidebar />

      <div className="designers-page">
        {/* Header */}
        <div className="designers-header">
          <div>
            <h1>Designers</h1>
            <p>Interior designers registered on Casa</p>
          </div>

          <input
            type="text"
            className="designer-search"
            placeholder="Search name, location, status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="designers-stats">
          <div className="stat-card">
            <h3>Total Designers</h3>
            <span>{designers.length}</span>
          </div>
          <div className="stat-card">
            <h3>Paid Subscription</h3>
            <span>{designers.filter(d => d.subscriptionStatus === "PAID").length}</span>
          </div>
          <div className="stat-card">
            <h3>Available</h3>
            <span>{designers.filter(d => d.availability === "AVAILABLE").length}</span>
          </div>
        </div>

        {/* Designers Table */}
        {loading ? (
          <p>Loading designers...</p>
        ) : (
          <div className="designers-table-wrapper">
            <table className="designers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Experience</th>
                  <th>Subscription</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDesigners.map((d) => (
                  <tr key={d.id}>
                    <td>{d.fullname}</td>
                    <td>{d.location}</td>
                    <td>{d.experience}</td>

                    <td>
                      <span
                        className={`badge ${d.subscriptionStatus === "PAID" ? "success" : "pending"
                          }`}
                      >
                        {d.subscriptionStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${d.availability === "AVAILABLE" ? "success" : "pending"
                          }`}
                      >
                        {d.availability}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${d.status.toLowerCase()}`}>
                        {d.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-view"
                        onClick={() =>
                          navigate("/designer-works", {
                            state: { designerId: d.id },
                          })
                        }
                      >
                        View Works
                      </button>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

            {!loading && filteredDesigners.length === 0 && (
              <div className="empty-state">No designers found</div>
            )}
          </div>
    </>
      );
};

      export default Designers;
