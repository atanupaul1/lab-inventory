import { useContext } from "react";
import { AppContext, API_URL } from "../context/AppContext";
import { FiBarChart2, FiAlertCircle, FiCheckCircle, FiInbox, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Skeleton from "../components/Skeleton";

function Reports() {
  const { items, requests, issues, user, refreshData, loading } = useContext(AppContext);

  // 📊 STATS
  const totalItems = items.length;
  const totalRequests = requests.length;
  const approved = requests.filter(r => r.status === "Approved").length;
  const pendingIssues = issues.filter(i => i.status === "Pending").length;

  // 🔧 RESOLVE ISSUE
  const resolveIssue = async (id) => {
    const loadingToast = toast.loading("Resolving issue...");
    try {
      const response = await fetch(`${API_URL}/issues/${id}?status=Resolved`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        toast.success("Issue marked as resolved", { id: loadingToast });
        refreshData();
      } else {
        toast.error("Failed to resolve issue", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: loadingToast });
    }
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Reports & Issues</h2>
        <p style={styles.subtitle}>System-wide overview of inventory status and reported user issues.</p>
      </div>

      {/* 📊 STATS GRID */}
      <div style={styles.grid}>
        <div className="card" style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.iconBox, background: "var(--color-accent-soft)", color: "var(--color-accent)"}}>
              <FiBarChart2 size={20} />
            </div>
            <span style={styles.statLabel}>Inventory Items</span>
          </div>
          <h2 style={styles.statValue}>{loading ? <Skeleton width="60px" height="44px" /> : totalItems}</h2>
          <div style={styles.statFooter}>
            <FiTrendingUp size={14} color="var(--color-success)" />
            <span style={{ color: "var(--color-success)", fontSize: "12px", fontWeight: "600" }}>Stable Stock</span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.iconBox, background: "var(--color-accent-soft)", color: "var(--color-accent)"}}>
              <FiInbox size={20} />
            </div>
            <span style={styles.statLabel}>Total Requests</span>
          </div>
          <h2 style={styles.statValue}>{loading ? <Skeleton width="60px" height="44px" /> : totalRequests}</h2>
          <div style={styles.statFooter}>
            <span style={{ color: "var(--color-text-dim)", fontSize: "12px" }}>Across all users</span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.iconBox, background: "var(--color-success-soft)", color: "var(--color-success)"}}>
              <FiCheckCircle size={20} />
            </div>
            <span style={styles.statLabel}>Approved</span>
          </div>
          <h2 style={styles.statValue}>{loading ? <Skeleton width="60px" height="44px" /> : approved}</h2>
          <div style={styles.statFooter}>
            <span style={{ color: "var(--color-text-dim)", fontSize: "12px" }}>Success rate: {totalRequests ? Math.round((approved/totalRequests)*100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* 🚨 ISSUES SECTION */}
      <div style={styles.issuesSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>User Reported Issues</h3>
          {pendingIssues > 0 && <span style={styles.alertBadge}>{pendingIssues} Pending</span>}
        </div>

        <div style={styles.issuesList}>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card" style={styles.issueCard}>
                <div style={styles.issueContent}>
                  <Skeleton width="44px" height="44px" borderRadius="12px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="100%" height="20px" margin="0 0 8px 0" />
                    <Skeleton width="60%" height="16px" />
                  </div>
                </div>
              </div>
            ))
          ) : issues.length === 0 ? (
            <div className="card" style={styles.emptyState}>
              <img src="/Online-reviews.png" alt="All Clear" style={{ width: "160px", marginBottom: "16px" }} />
              <p style={{ color: "var(--color-text-dim)" }}>All clear! No issues reported.</p>
            </div>
          ) : (
            issues.slice().reverse().map((i) => (
              <div key={i.id} className="card" style={styles.issueCard}>
                <div style={styles.issueContent}>
                  <div style={styles.issueIcon}>
                    {i.status === "Resolved" ? <FiCheckCircle color="var(--color-success)" /> : <FiAlertCircle color="var(--color-warning)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.issueText}>{i.text}</p>
                    <div style={styles.issueMeta}>
                      <span>Reported by: <b>{i.user}</b></span>
                      <span style={styles.dot}>•</span>
                      <span>Status: <b style={{ color: i.status === "Resolved" ? "var(--color-success)" : "var(--color-warning)" }}>{i.status}</b></span>
                    </div>
                  </div>
                  {i.status === "Pending" && (
                    <button
                      className="btn-primary"
                      style={styles.resolveBtn}
                      onClick={() => resolveIssue(i.id)}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  statCard: {
    padding: "24px",
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "800",
    color: "var(--color-text-primary)",
    margin: "0 0 12px 0",
  },
  statFooter: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingTop: "12px",
    borderTop: "1px solid var(--color-border)",
  },
  issuesSection: {
    marginTop: "40px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  alertBadge: {
    padding: "4px 12px",
    background: "var(--color-danger-soft)",
    color: "var(--color-danger)",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  issuesList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  issueCard: {
    padding: "20px",
  },
  issueContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  issueIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "var(--color-subtle-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  issueText: {
    fontSize: "15px",
    fontWeight: "500",
    color: "var(--color-text-primary)",
    margin: 0,
    lineHeight: "1.5",
  },
  issueMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    fontSize: "13px",
    color: "var(--color-text-dim)",
  },
  dot: {
    opacity: 0.3,
  },
  resolveBtn: {
    padding: "8px 20px",
    fontSize: "13px",
    height: "36px",
  },
  emptyState: {
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }
};

export default Reports;