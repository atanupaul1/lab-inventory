import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FiCheckCircle, FiPackage, FiCalendar } from "react-icons/fi";
import Skeleton from "../components/Skeleton";

function History() {
  const { requests, items, loading } = useContext(AppContext);

  const approved = requests.filter((r) => r.status === "Approved");

  const getItemName = (id) => {
    const item = items.find(i => i.id === id);
    return item ? item.name : "Unknown Item";
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Borrow History</h2>
        <p style={styles.subtitle}>Review your successfully processed and approved lab resource requests.</p>
      </div>

      <div style={styles.listGrid}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card" style={styles.historyCard}>
              <div style={styles.cardMain}>
                <Skeleton width="44px" height="44px" borderRadius="12px" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="200px" height="20px" margin="0 0 8px 0" />
                  <Skeleton width="150px" height="16px" />
                </div>
              </div>
            </div>
          ))
        ) : approved.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <img src="/Nothing-here.png" alt="Empty" style={{ width: "160px", marginBottom: "16px" }} />
            <p style={{ color: "var(--color-text-dim)" }}>No borrow history found yet.</p>
          </div>
        ) : (
          approved.map((r) => (
            <div key={r.id} className="card" style={styles.historyCard}>
              <div style={styles.cardMain}>
                <div style={styles.itemIcon}>
                  <FiPackage size={20} color="var(--color-success)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={styles.itemName}>{getItemName(r.item_id)}</h4>
                  <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                      <FiCheckCircle size={14} />
                      <span>Approved</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiCalendar size={14} />
                      <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.quantityBadge}>
                  {r.quantity} Units
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
    maxWidth: "1000px",
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
  historyCard: {
    padding: "16px 20px",
    transition: "transform 0.2s ease",
  },
  cardMain: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  itemIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "var(--color-success-soft)",
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
  metaRow: {
    display: "flex",
    gap: "16px",
    marginTop: "6px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "var(--color-text-dim)",
  },
  quantityBadge: {
    padding: "6px 14px",
    background: "var(--color-subtle-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
  },
  emptyState: {
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

export default History;