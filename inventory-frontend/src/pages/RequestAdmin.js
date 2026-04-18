import { useContext } from "react";
import { AppContext, API_URL } from "../context/AppContext";
import { FiCheckCircle, FiXCircle, FiPackage, FiAlertTriangle, FiMapPin, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";

function RequestAdmin() {
  const { requests, items, user, refreshData } = useContext(AppContext);

  const updateStatus = async (id, status) => {
    const actionToast = toast.loading(`${status === "Approved" ? "Approving" : "Rejecting"} request...`);
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          status,
          admin_message: `Request ${status} by Administrator`
        }),
      });

      if (response.ok) {
        toast.success(`Request ${status.toLowerCase()}`, { id: actionToast });
        refreshData();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to update request", { id: actionToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: actionToast });
    }
  };

  const getItemName = (id) => {
    const item = items.find(i => i.id === id);
    return item ? item.name : "Unknown Item";
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Requests</h2>
        <p style={styles.subtitle}>Review and process inventory borrow requests from laboratory users.</p>
      </div>

      <div style={styles.listGrid}>
        {requests.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <img src="/Online-reviews.png" alt="Empty" style={{ width: "180px", marginBottom: "20px" }} />
            <p style={{ color: "var(--color-text-dim)" }}>No active hardware requests in the queue.</p>
          </div>
        ) : (
          requests.slice().reverse().map((r) => (
            <div key={r.id} className="card" style={styles.requestCard}>
              <div style={styles.cardMain}>
                <div style={styles.itemIcon}>
                  <FiPackage size={20} color="var(--color-accent)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={styles.itemName}>{getItemName(r.item_id)}</h4>
                  <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                      <FiUser size={14} color="var(--color-accent)" />
                      <span style={{ fontWeight: "600" }}>{r.user?.full_name || "Unknown User"}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiMapPin size={14} color="var(--color-warning)" />
                      <span>{r.location || "Main Lab"}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiAlertTriangle size={14} />
                      <span>{r.quantity} Units</span>
                    </div>
                  </div>
                </div>

                {r.status === "Pending" && (
                  <div style={styles.actionGroup}>
                    <button
                      onClick={() => updateStatus(r.id, "Approved")}
                      className="btn-primary"
                      style={styles.approveBtn}
                    >
                      <FiCheckCircle />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => updateStatus(r.id, "Rejected")}
                      style={styles.rejectBtn}
                    >
                      <FiXCircle />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {r.status !== "Pending" && (
                  <div style={{
                    ...styles.finalStatus,
                    color: r.status === "Approved" ? "var(--color-success)" : "var(--color-danger)"
                  }}>
                    {r.status === "Approved" ? <FiCheckCircle /> : <FiXCircle />}
                    <span>{r.status}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 32px",
    maxWidth: "1100px",
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
  listGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  requestCard: {
    padding: "20px 24px",
  },
  cardMain: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  itemIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "var(--color-accent-soft)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--color-subtle-border)",
  },
  itemName: {
    fontSize: "17px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  metaRow: {
    display: "flex",
    gap: "20px",
    marginTop: "6px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "var(--color-text-dim)",
  },
  actionGroup: {
    display: "flex",
    gap: "12px",
  },
  approveBtn: {
    height: "38px",
    padding: "0 16px",
    fontSize: "13px",
    background: "var(--color-success)",
  },
  rejectBtn: {
    height: "38px",
    padding: "0 16px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--color-danger-soft)",
    color: "var(--color-danger)",
    borderRadius: "20px",
    fontWeight: "600",
  },
  finalStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  emptyState: {
    padding: "80px",
    textAlign: "center",
  }
};

export default RequestAdmin;