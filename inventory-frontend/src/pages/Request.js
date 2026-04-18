import { useState, useContext } from "react";
import { AppContext, API_URL } from "../context/AppContext";
import { FiSend, FiPackage, FiHash, FiClock, FiCheckCircle, FiXCircle, FiMapPin, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";

function Request() {
  const { items, requests, user, refreshData } = useContext(AppContext);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("Lab A");
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    if (!selectedItemId || !quantity) return;

    const item = items.find((i) => i.id === Number(selectedItemId));

    if (Number(quantity) > item.quantity) {
      toast.error(`Not enough stock! Only ${item.quantity} available.`);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Sending request...");
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          item_id: Number(selectedItemId), 
          quantity: Number(quantity),
          location: location,
          purpose: "Laboratory Project",
          return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
        }),
      });

      if (response.ok) {
        toast.success("Request sent to administrator", { id: loadingToast });
        setSelectedItemId("");
        setQuantity("");
        refreshData();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to submit request", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "var(--color-success)";
      case "Rejected": return "var(--color-danger)";
      default: return "var(--color-warning)";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "Approved": return "var(--color-success-soft)";
      case "Rejected": return "var(--color-danger-soft)";
      default: return "var(--color-warning-soft)";
    }
  };

  const getItemName = (id) => {
    const item = items.find(i => i.id === id);
    return item ? item.name : "Unknown Item";
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Issue Hardware</h2>
        <p style={styles.subtitle}>Request tools or materials for your laboratory research.</p>
      </div>

      {/* USER PROFILE SECTION */}
      <div className="card" style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <h3 style={styles.profileName}>{user?.full_name}</h3>
            <p style={styles.profileEmail}>{user?.email}</p>
            <div style={styles.profileBadge}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* REQUEST FORM */}
      <div className="card" style={styles.formCard}>
        <h3 style={styles.boxTitle}>New Hardware Issuance</h3>
        
        <div style={styles.formSplit}>
          <div style={styles.formColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Hardware</label>
              <div style={styles.inputWrapper}>
                <FiPackage style={styles.inputIcon} />
                <select
                  className="input-field"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  style={{ paddingLeft: "44px", appearance: "none" }}
                >
                  <option value="">Choose an item...</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Quantity</label>
                <div style={styles.inputWrapper}>
                  <FiHash style={styles.inputIcon} />
                  <input
                    type="number"
                    placeholder="0"
                    className="input-field"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ paddingLeft: "44px" }}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Issuance Location</label>
                <div style={styles.inputWrapper}>
                  <FiMapPin style={styles.inputIcon} />
                  <select
                    className="input-field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ paddingLeft: "44px" }}
                  >
                    <option value="Lab A">Lab A</option>
                    <option value="Lab B">Lab B</option>
                    <option value="Store Room">Store Room</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={submitRequest} 
              style={styles.submitBtn}
              disabled={!selectedItemId || !quantity || loading}
            >
              <FiSend />
              <span>{loading ? "Issuing..." : "Issue Hardware"}</span>
            </button>
          </div>

          <div style={styles.previewColumn}>
            {selectedItemId ? (
              <div style={styles.previewCard}>
                <div style={styles.previewHeader}>
                  <FiInfo color="var(--color-accent)" />
                  <span>Hardware Details</span>
                </div>
                {(() => {
                  const item = items.find(i => i.id === Number(selectedItemId));
                  return item ? (
                    <div style={styles.previewContent}>
                      <h4 style={styles.previewName}>{item.name}</h4>
                      <p style={styles.previewText}><b>Category:</b> {item.category}</p>
                      <p style={styles.previewText}><b>Availability:</b> {item.quantity} Units</p>
                      <p style={styles.previewText}><b>Estimated Price:</b> ${item.price}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            ) : (
              <div style={styles.previewPlaceholder}>
                <FiPackage size={30} color="var(--color-text-dim)" />
                <p>Select hardware to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REQUEST LIST */}
      <div style={styles.listHeader}>
        <h3 style={styles.boxTitle}>My Recent Requests</h3>
        <span style={styles.countBadge}>{requests.length} Total</span>
      </div>

      <div style={styles.listGrid}>
        {requests.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <img src="/Save-time.png" alt="Empty" style={{ width: "160px", marginBottom: "16px" }} />
            <p style={{ color: "var(--color-text-dim)" }}>No hardware requests made yet.</p>
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
                  <p style={styles.itemMeta}>Quantity: {r.quantity}</p>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  background: getStatusBg(r.status),
                  color: getStatusColor(r.status)
                }}>
                  {r.status === "Approved" && <FiCheckCircle size={14} />}
                  {r.status === "Rejected" && <FiXCircle size={14} />}
                  {r.status === "Pending" && <FiClock size={14} />}
                  <span>{r.status}</span>
                </div>
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
    maxWidth: "1200px",
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
  profileCard: {
    padding: "20px",
    marginBottom: "24px",
    background: "var(--color-bg-elevated)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "var(--color-accent)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
    boxShadow: "0 0 20px var(--color-accent-soft)",
  },
  profileName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  profileEmail: {
    fontSize: "13px",
    color: "var(--color-text-dim)",
    margin: "2px 0 6px 0",
  },
  profileBadge: {
    display: "inline-block",
    padding: "2px 10px",
    background: "var(--color-accent-soft)",
    color: "var(--color-accent)",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  formSplit: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  formColumn: {
    flex: "2",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  previewColumn: {
    flex: "1",
    minWidth: "260px",
  },
  previewCard: {
    padding: "20px",
    background: "var(--color-bg-primary)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--border-radius-md)",
    height: "100%",
  },
  previewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--color-border)",
  },
  previewContent: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  previewName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--color-accent)",
    margin: "0 0 10px 0",
  },
  previewText: {
    fontSize: "13px",
    color: "var(--color-text-secondary)",
    margin: 0,
  },
  previewPlaceholder: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--color-subtle-bg)",
    border: "2px dashed var(--color-border)",
    borderRadius: "var(--border-radius-md)",
    padding: "40px 20px",
    textAlign: "center",
    color: "var(--color-text-dim)",
    fontSize: "14px",
    gap: "12px",
  },
  boxTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: "0 0 24px 0",
  },
  formRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    minWidth: "200px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    color: "var(--color-text-dim)",
    fontSize: "18px",
    pointerEvents: "none",
  },
  submitBtn: {
    height: "52px",
    padding: "0 32px",
    gap: "12px",
    fontSize: "15px",
    marginTop: "10px",
    alignSelf: "flex-start",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "20px",
  },
  countBadge: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--color-text-dim)",
    background: "var(--color-bg-elevated)",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid var(--color-border)",
  },
  listGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  requestCard: {
    padding: "16px 24px",
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
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  itemMeta: {
    fontSize: "13px",
    color: "var(--color-text-dim)",
    margin: "4px 0 0 0",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    marginLeft: "auto",
  },
  emptyState: {
    padding: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }
};

export default Request;