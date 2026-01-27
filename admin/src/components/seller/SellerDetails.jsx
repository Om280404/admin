import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SellerDetails.css";
import Sidebar from "../sidebar/Sidebar";

const SellerDetails = () => {
  const { state } = useLocation();
  const sellerId = state?.sellerId;

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Helper to fetch/refresh details
  const fetchDetails = () => {
    if (!sellerId) return;
    setLoading(true);
    fetch(`http://localhost:5000/admin/sellers/${sellerId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Seller not found");
        return res.json();
      })
      .then((data) => {
        setSeller(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch seller error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, [sellerId]);

  // Handler to toggle verification status
  const handleVerify = () => {
    if (!seller) return;
    setUpdating(true);

    // Toggle logic: if true, set to false; if false, set to true
    const newStatus = !seller.isVerified;

    fetch(`http://localhost:5000/admin/sellers/${sellerId}/verify`, {
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
          // Re-fetch to update the UI with new status and label
          fetchDetails();
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        alert("Action failed. Please check the backend connection.");
      })
      .finally(() => setUpdating(false));
  };

  if (!sellerId) return <><Sidebar /><div className="seller-details-page"><p>No seller selected.</p></div></>;
  if (loading) return <><Sidebar /><div className="seller-details-page"><p>Loading seller details...</p></div></>;
  if (!seller) return <><Sidebar /><div className="seller-details-page"><p>Seller not found.</p></div></>;

  const { seller: sellerInfo, business, delivery, bank } = seller;

  return (
    <>
      <Sidebar />
      <div className="seller-details-page">
        <div className="seller-header">
          <div className="header-info">
            <h1>{business?.businessName || "Business details not provided"}</h1>
            <span className={`status ${seller.status.toLowerCase()}`}>
              {seller.status}
            </span>
          </div>

          <button
            className={`btn-verify ${seller.isVerified ? 'unverify' : 'verify'}`}
            onClick={handleVerify}
            disabled={updating}
          >
            {updating ? "Processing..." : seller.isVerified ? "Revoke Verification" : "Set Verified"}
          </button>
        </div>

        <div className="details-grid">
          {/* Seller Info Section */}
          <section className="section">
            <h2>Seller Info</h2>
            <p><strong>Name:</strong> {sellerInfo?.name}</p>
            <p><strong>Email:</strong> {sellerInfo?.email}</p>
            <p><strong>Phone:</strong> {sellerInfo?.phone}</p>
            <p><strong>Joined:</strong> {new Date(sellerInfo?.createdAt).toDateString()}</p>
          </section>

          {/* Business Details Section */}
          <section className="section">
            <h2>Business Details</h2>
            {business ? (
              <>
                <p><strong>Type:</strong> {business.sellerType || "-"}</p>
                <p><strong>City:</strong> {business.city || "-"}</p>
                <p><strong>Address:</strong> {business.address || "-"}</p>
                <p><strong>GST:</strong> {business.gst || "-"}</p>
              </>
            ) : <p className="muted">Business details not provided</p>}
          </section>

          {/* Bank Details Section */}
          <section className="section bank-details-section">
            <h2>Bank Details</h2>
            {bank ? (
              <>
                <p><strong>Account Holder:</strong> {bank.accountHolder}</p>
                <p><strong>Bank Name:</strong> {bank.bankName || "-"}</p>
                <p><strong>Account Number:</strong> {bank.accountNumber || "-"}</p>
                <p><strong>IFSC Code:</strong> {bank.ifsc || "-"}</p>
                <p><strong>UPI ID:</strong> {bank.upiId || "-"}</p>
              </>
            ) : <p className="muted">Bank details not provided</p>}
          </section>

          {/* Delivery Details Section */}
          <section className="section">
            <h2>Delivery</h2>
            {delivery ? (
              <>
                <p><strong>Time:</strong> {delivery.deliveryTimeMin || "-"}–{delivery.deliveryTimeMax || "-"} days</p>
                <p><strong>Charge:</strong> ₹{delivery.shippingCharge || 0}</p>
                <p><strong>Installation:</strong> {delivery.installationAvailable || "No"}</p>
              </>
            ) : <p className="muted">Delivery details not provided</p>}
          </section>
        </div>
      </div>
    </>
  );
};

export default SellerDetails;