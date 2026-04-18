import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FiFolder, FiPackage, FiAlertTriangle, FiArrowUpRight } from "react-icons/fi";
import Skeleton from "../components/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function Dashboard() {
  const { items, requests, projects, loading } = useContext(AppContext);

  const totalItems = items.length;
  const totalProjects = projects.length;
  const lowStock = items.filter((i) => i.quantity < 5).length;

  const itemData = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  const recentActivity = requests.slice(-4).reverse();

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard Overview</h2>
        <p style={styles.subtitle}>Welcome back! Here's what's happening in the lab today.</p>
      </div>

      {/* STAT CARDS */}
      <div style={styles.cards}>
        {[
          { label: "Total Projects", value: totalProjects, icon: <FiFolder size={20} />, color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.1)" },
          { label: "Inventory Items", value: totalItems, icon: <FiPackage size={20} />, color: "var(--color-accent)", bg: "rgba(20, 184, 166, 0.1)" },
          { label: "Low Stock Alert", value: lowStock, icon: <FiAlertTriangle size={20} />, color: "var(--color-danger)", bg: "var(--color-danger-soft)" }
        ].map((card, i) => (
          <div key={i} className="card" style={styles.statCard}>
            <div style={styles.statInfo}>
              <p style={styles.cardLabel}>{card.label}</p>
              {loading ? (
                <Skeleton width="60px" height="38px" margin="4px 0" />
              ) : (
                <h1 style={{ ...styles.cardValue, color: i === 2 ? card.color : "var(--color-text-primary)" }}>{card.value}</h1>
              )}
            </div>
            <div style={{...styles.iconWrapper, background: card.bg, color: card.color}}>
               {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={styles.grid}>
        {/* INVENTORY CHART */}
        <div className="card" style={styles.chartBox}>
          <div style={styles.boxHeader}>
            <h3 style={styles.boxTitle}>Inventory Distribution</h3>
            <button style={styles.viewAllBtn}>Details <FiArrowUpRight /></button>
          </div>

          <div style={{ height: 300, width: "100%", marginTop: "20px" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "100%", padding: "20px" }}>
                <Skeleton width="30px" height="60%" />
                <Skeleton width="30px" height="80%" />
                <Skeleton width="30px" height="40%" />
                <Skeleton width="30px" height="90%" />
                <Skeleton width="30px" height="70%" />
                <Skeleton width="30px" height="50%" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={itemData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--color-text-dim)" 
                    fontSize={12}
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="var(--color-text-dim)" 
                    fontSize={12}
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-hover-bg)' }} 
                    contentStyle={{ 
                      background: 'var(--color-bg-light)', 
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }} 
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="var(--color-accent)"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="card" style={styles.recentBox}>
          <div style={styles.boxHeader}>
            <h3 style={styles.boxTitle}>Recent Activity</h3>
            <span style={styles.newBadge}>Live Update</span>
          </div>

          <div style={styles.activityList}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} style={styles.activityItem}>
                  <Skeleton width="40px" height="40px" borderRadius="10px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="120px" height="16px" margin="0 0 6px 0" />
                    <Skeleton width="80px" height="12px" />
                  </div>
                </div>
              ))
            ) : (
              recentActivity.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><FiPackage size={40} /></div>
                  <p style={{ color: "var(--color-text-dim)" }}>No recent activity to show</p>
                </div>
              ) : recentActivity.map((req, i) => (
                <div key={i} style={styles.activityItem}>
                  <div style={styles.activityIcon}>
                    {req.status === "Approved" ? <FiPackage color="var(--color-success)" /> : <FiAlertTriangle color="var(--color-warning)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={styles.activityTitle}>{req.item?.name || "Hardware"} {req.status === "Approved" ? "Dispensed" : "Requested"}</h4>
                    <p style={styles.activitySub}>Status: {req.status}</p>
                  </div>
                  <div style={styles.activityTime}>Just now</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--color-text-dim)",
    marginTop: "4px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
    margin: 0,
  },
  cardValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "24px",
  },
  chartBox: {
    padding: "24px",
  },
  recentBox: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
  },
  boxHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  boxTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  viewAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--color-accent)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  newBadge: {
    padding: "4px 10px",
    background: "rgba(20, 184, 166, 0.1)",
    color: "var(--color-accent)",
    fontSize: "11px",
    fontWeight: "700",
    borderRadius: "20px",
    textTransform: "uppercase",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "16px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    background: "var(--color-subtle-bg)",
    border: "1px solid var(--color-subtle-border)",
    transition: "transform 0.2s ease",
  },
  activityIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "var(--color-hover-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  activitySub: {
    fontSize: "12px",
    color: "var(--color-text-dim)",
    margin: "2px 0 0 0",
  },
  activityTime: {
    fontSize: "12px",
    color: "var(--color-text-dim)",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "var(--color-subtle-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    color: "var(--color-text-dim)",
  }
};

export default Dashboard;