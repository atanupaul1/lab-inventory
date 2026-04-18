import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FiUser, FiMail, FiShield, FiSettings, FiEdit3 } from "react-icons/fi";

function Profile() {
  const { user } = useContext(AppContext);

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Profile</h2>
        <p style={styles.subtitle}>View and manage your personal lab account details.</p>
      </div>

      <div style={styles.grid}>
        {/* PROFILE CARD */}
        <div className="card" style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <FiUser size={40} color="var(--color-accent)" />
            </div>
            <div style={styles.nameInfo}>
              <h3 style={styles.fullName}>{user?.full_name || "Lab User"}</h3>
              <div style={styles.roleBadge}>
                <FiShield size={12} />
                <span>{user?.role || "Student"}</span>
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}><FiMail size={18} /></div>
              <div>
                <p style={styles.infoLabel}>Email Address</p>
                <p style={styles.infoValue}>{user?.email}</p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoIcon}><FiShield size={18} /></div>
              <div>
                <p style={styles.infoLabel}>Account Access</p>
                <p style={styles.infoValue}>{user?.role} Level</p>
              </div>
            </div>
          </div>

          <button className="btn-primary" style={styles.editBtn}>
            <FiEdit3 />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* ACCOUNT SETTINGS SIDEBAR */}
        <div style={styles.sidebar}>
          <div className="card" style={styles.settingsCard}>
            <h4 style={styles.sidebarTitle}>Account Settings</h4>
            <div style={styles.settingsList}>
              <button style={styles.settingsItem}>
                <FiSettings />
                <span>Security Settings</span>
              </button>
              <button style={styles.settingsItem}>
                <FiMail />
                <span>Notification Prefs</span>
              </button>
            </div>
          </div>
          
          <div style={styles.proTip}>
            <FiShield color="var(--color-accent)" />
            <p style={styles.proTipText}>Admin access grants permission to manage inventory and approve requests.</p>
          </div>
        </div>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "32px",
  },
  profileCard: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    background: "rgba(20, 184, 166, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(20, 184, 166, 0.2)",
  },
  nameInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fullName: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    background: "var(--color-hover-bg)",
    color: "var(--color-text-secondary)",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    width: "fit-content",
  },
  divider: {
    height: "1px",
    background: "var(--color-border)",
    margin: "0 0 32px 0",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginBottom: "40px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  infoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "var(--color-subtle-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--color-text-dim)",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--color-text-dim)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "16px",
    fontWeight: "500",
    color: "var(--color-text-primary)",
    margin: "4px 0 0 0",
  },
  editBtn: {
    height: "48px",
    width: "100%",
    gap: "10px",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  settingsCard: {
    padding: "24px",
  },
  sidebarTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: "0 0 20px 0",
  },
  settingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  settingsItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 16px",
    background: "var(--color-subtle-bg)",
    border: "1px solid var(--color-subtle-border)",
    borderRadius: "12px",
    color: "var(--color-text-secondary)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
  },
  proTip: {
    padding: "20px",
    background: "rgba(20, 184, 166, 0.05)",
    borderRadius: "16px",
    border: "1px solid rgba(20, 184, 166, 0.1)",
    display: "flex",
    gap: "12px",
  },
  proTipText: {
    fontSize: "13px",
    color: "var(--color-text-dim)",
    margin: 0,
    lineHeight: "1.5",
  }
};

export default Profile;