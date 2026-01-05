// src/components/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import "./Dashboard.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#606e52", "#f59e0b", "#ef4444", "#06b6d4"];
const PIE_COLORS = ["#606e52", "#93c47d", "#c7d6a6"];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="dashboard-page">
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar />
        <div className="dashboard-page">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </>
    );
  }

  const {
    stats = {},
    ordersOverTime = [],
    returnsByStatus = [],
    platformMix = [],
  } = data || {};


  return (
    <>
      <Sidebar />

      <div className="dashboard-page">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of Core2Cover platform activity</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <span>{stats.totalUsers}</span>
          </div>

          <div className="stat-card">
            <h3>Total Sellers</h3>
            <span>{stats.totalSellers}</span>
          </div>

          <div className="stat-card">
            <h3>Total Designers</h3>
            <span>{stats.totalDesigners}</span>
          </div>

          <div className="stat-card">
            <h3>Total Orders</h3>
            <span>{stats.totalOrders}</span>
          </div>

          <div className="stat-card">
            <h3>Completed Orders</h3>
            <span>{stats.completedOrders ?? stats.totalOrders}</span>
          </div>

          <div className="stat-card warning">
            <h3>Pending Returns</h3>
            <span>{stats.pendingReturns}</span>
          </div>

          <div className="stat-card success">
            <h3>Completed Refunds</h3>
            <span>{stats.completedRefunds}</span>
          </div>
        </div>

        {/* Charts */}
        {/* Charts */}
        <div className="dashboard-charts">
          {/* Orders & Revenue */}
          <div className="chart-card full-width">
            <h3 className="chart-title">Orders & Revenue</h3>

            <ResponsiveContainer width="100%" aspect={3}>
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efefef" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS[3]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Returns */}
          <div className="chart-card">
            <h3 className="chart-title">Returns by Status</h3>

            <ResponsiveContainer width="100%" aspect={3}>
              <BarChart data={returnsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efefef" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {returnsByStatus.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Mix */}
          <div className="chart-card">
            <h3 className="chart-title">Platform Composition</h3>

            <ResponsiveContainer width="100%" aspect={3}>
              <PieChart>
                <Pie
                  data={platformMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {platformMix.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
