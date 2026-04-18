import { useNavigate } from "react-router-dom";
import { FiShield, FiUser, FiArrowRight } from "react-icons/fi";

function Portal() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to LabFlow</h1>
        <p style={styles.subtitle}>Select your portal to continue to the inventory system.</p>
      </div>

      <div style={styles.grid}>
        {/* Admin */}
        <div
          onClick={() => navigate("/")}
          className="card glass"
          style={styles.portalCard}
        >
          <div style={{...styles.iconBox, background: "rgba(14, 165, 233, 0.1)", color: "var(--color-accent)"}}>
            <FiShield size={32} />
          </div>
          <h2 style={styles.cardTitle}>Admin Portal</h2>
          <p style={styles.cardDesc}>Manage inventory, approve requests, and review system reports.</p>
          <div style={styles.cardAction}>
            <span>Login as Admin</span>
            <FiArrowRight />
          </div>
        </div>

        {/* Student */}
        <div
          onClick={() => navigate("/")}
          className="card glass"
          style={styles.portalCard}
        >
          <div style={{...styles.iconBox, background: "rgba(20, 184, 166, 0.1)", color: "var(--color-accent)"}}>
            <FiUser size={32} />
          </div>
          <h2 style={styles.cardTitle}>Student Portal</h2>
          <p style={styles.cardDesc}>Request lab equipment, track your borrow history, and report issues.</p>
          <div style={styles.cardAction}>
            <span>Login as Student</span>
            <FiArrowRight />
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    background: "var(--color-bg-primary)",
  },
  header: {
    textAlign: "center",
    marginBottom: "60px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "800",
    color: "var(--color-text-primary)",
    letterSpacing: "-1px",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "18px",
    color: "var(--color-text-dim)",
    maxWidth: "500px",
  },
  grid: {
    display: "flex",
    gap: "32px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  portalCard: {
    width: "320px",
    padding: "40px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  iconBox: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    marginBottom: "16px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "var(--color-text-dim)",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  cardAction: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--color-accent)",
    fontWeight: "600",
    fontSize: "15px",
  }
};

export default Portal;