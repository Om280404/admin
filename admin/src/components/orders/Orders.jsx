import { useEffect, useState } from "react";
import React from "react";
import "./Orders.css";
import Sidebar from "../sidebar/Sidebar";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/admin/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredOrders = orders.filter((o) =>
    `${o.id} ${o.customerName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="orders-page">
          <p>Loading orders...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="orders-page">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>All customer orders & seller-wise breakdown</p>
          </div>

          <input
            type="text"
            className="order-search"
            placeholder="Search by order id or customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                {/* Order Row */}
                <tr>
                  <td>#ORD-{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>₹{order.grandTotal}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>

                {/* Items */}
                <tr className="order-items-row">
                  <td colSpan="4">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Seller</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.materialName}</td>
                            <td>{item.seller?.name || "-"}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.pricePerUnit}</td>
                            <td>₹{item.totalAmount}</td>
                            <td>
                              <span className="badge success">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-state">No orders found</div>
        )}
      </div>
    </>
  );
};

export default Orders;
