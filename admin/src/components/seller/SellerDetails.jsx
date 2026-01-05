import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SellerDetails.css";
import Sidebar from "../sidebar/Sidebar";

const SellerDetails = () => {
    const { state } = useLocation();
    const sellerId = state?.sellerId;

    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sellerId) return;

        fetch(`http://localhost:5000/admin/sellers/${sellerId}`)
            .then((res) => res.json())
            .then((data) => {
                setSeller(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [sellerId]);

    if (!sellerId) {
        return (
            <>
                <Sidebar />
                <div className="seller-details-page">
                    <p>No seller selected.</p>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Sidebar />
                <div className="seller-details-page">
                    <p>Loading seller details...</p>
                </div>
            </>
        );
    }

    if (!seller) {
        return (
            <>
                <Sidebar />
                <div className="seller-details-page">
                    <p>Seller not found.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Sidebar />

            <div className="seller-details-page">
                <div className="seller-header">
                    <h1>{seller.business?.businessName || "Business details not provided"}</h1>
                    <span className={`status ${seller.status.toLowerCase()}`}>
                        {seller.status}
                    </span>
                </div>

                <section className="section">
                    <h2>Seller Info</h2>
                    <p><strong>Name:</strong> {seller.seller.name}</p>
                    <p><strong>Email:</strong> {seller.seller.email}</p>
                    <p><strong>Phone:</strong> {seller.seller.phone}</p>
                    <p>
                        <strong>Joined:</strong>{" "}
                        {new Date(seller.seller.createdAt).toDateString()}
                    </p>
                </section>

                <section className="section">
                    <h2>Business Details</h2>

                    {seller.business ? (
                        <>
                            <p><strong>Type:</strong> {seller.business.sellerType || "-"}</p>
                            <p><strong>City:</strong> {seller.business.city || "-"}</p>
                            <p><strong>GST:</strong> {seller.business.gst || "-"}</p>
                        </>
                    ) : (
                        <p className="muted">Business details not provided</p>
                    )}
                </section>

                <section className="section">
                    <h2>Delivery</h2>

                    {seller.delivery ? (
                        <>
                            <p>
                                Time: {seller.delivery.deliveryTimeMin}–
                                {seller.delivery.deliveryTimeMax} days
                            </p>
                            <p>Charge: ₹{seller.delivery.shippingCharge}</p>
                            <p>
                                Installation: {seller.delivery.installationAvailable}
                            </p>
                        </>
                    ) : (
                        <p className="muted">Delivery details not provided</p>
                    )}
                </section>


            </div>
        </>
    );
};

export default SellerDetails;
