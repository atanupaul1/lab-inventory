import { useState, useContext } from "react";
import { AppContext, API_URL } from "../context/AppContext";
import { FiAlertCircle, FiSend, FiMessageSquare, FiList } from "react-icons/fi";

function ReportIssue() {
  const { issues, user, refreshData } = useContext(AppContext);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitIssue = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/issues`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setSubmitted(true);
        setText("");
        refreshData();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert("Failed to submit report");
      }
    } catch (err) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Report an Issue</h2>
        <p style={styles.subtitle}>Help us improve LabFlow by reporting technical bugs or equipment failures.</p>
      </div>

      <div style={styles.grid}>
        {/* FORM */}
        <div className="card" style={styles.formCard}>
          <div style={styles.boxHeader}>
            <FiMessageSquare color="var(--color-accent)" size={20} />
            <h3 style={styles.boxTitle}>Issue Details</h3>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What went wrong? Please be as specific as possible..."
              className="input-field"
              style={styles.textarea}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={submitIssue} 
            style={styles.submitBtn}
            disabled={!text || loading}
          >
            {submitted ? <FiAlertCircle /> : <FiSend />}
            <span>{loading ? "Submitting..." : (submitted ? "Issue Submitted!" : "Submit Report")}</span>
          </button>
        </div>

        {/* RECENT ISSUES */}
        <div className="card" style={styles.historyCard}>
          <div style={styles.boxHeader}>
            <FiList color="var(--color-accent)" size={20} />
            <h3 style={styles.boxTitle}>Recent Reports</h3>
          </div>
          
          <div style={styles.issueList}>
            {issues.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                <img src="/Nothing-here.png" alt="Empty" style={{ width: "120px", marginBottom: "12px" }} />
                <p style={{ color: "var(--color-text-dim)", fontSize: "13px" }}>No issues reported yet.</p>
              </div>
            ) : issues.slice().reverse().slice(0, 5).map((issue) => (
              <div key={issue.id} style={styles.issueItem}>
                <div style={{
                  ...styles.issueMarker,
                  background: issue.status === "Resolved" ? "var(--color-success)" : "var(--color-accent)"
                }} />
                <div style={{ flex: 1 }}>
                  <p style={styles.issueText}>{issue.text.substring(0, 80)}{issue.text.length > 80 ? "..." : ""}</p>
                  <p style={{
                    ...styles.issueMeta,
                    color: issue.status === "Resolved" ? "var(--color-success)" : "var(--color-text-dim)"
                  }}>
                    Status: {issue.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "24px",
  },
  formCard: {
    padding: "24px",
  },
  historyCard: {
    padding: "24px",
  },
  boxHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  boxTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--color-text-secondary)",
  },
  textarea: {
    width: "100%",
    minHeight: "160px",
    padding: "16px",
    resize: "none",
  },
  submitBtn: {
    width: "100%",
    height: "48px",
    gap: "10px",
  },
  issueList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  issueItem: {
    display: "flex",
    gap: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "var(--color-subtle-bg)",
    border: "1px solid var(--color-subtle-border)",
  },
  issueMarker: {
    width: "4px",
    height: "auto",
    borderRadius: "4px",
  },
  issueText: {
    fontSize: "14px",
    color: "var(--color-text-primary)",
    margin: 0,
    lineHeight: "1.5",
  },
  issueMeta: {
    fontSize: "12px",
    margin: "6px 0 0 0",
    fontWeight: "600",
  }
};

export default ReportIssue;