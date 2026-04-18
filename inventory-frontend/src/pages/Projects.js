import { useState, useContext } from "react";
import { AppContext, API_URL } from "../context/AppContext";
import { FiFolder, FiPlus, FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import ConfirmModal from "../components/ConfirmModal";

function Projects() {
  const { projects, user, refreshData, loading } = useContext(AppContext);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const addProject = async () => {
    if (!name || !startDate || !endDate) return toast.error("Please fill in all fields");

    setSaving(true);
    const loadingToast = toast.loading(editId ? "Updating project..." : "Launching project...");
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          name, 
          start_date: startDate, 
          end_date: endDate,
          status: "Active"
        }),
      });

      if (response.ok) {
        toast.success(editId ? "Project updated" : "Project launched successfully!", { id: loadingToast });
        setName("");
        setStartDate("");
        setEndDate("");
        setEditId(null);
        refreshData();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to save project", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async () => {
    if (!confirmId) return;

    setShowConfirm(false);
    const deletingToast = toast.loading("Deleting project...");
    try {
      const response = await fetch(`${API_URL}/projects/${confirmId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        toast.success("Project deleted", { id: deletingToast });
        refreshData();
      } else {
        toast.error("Failed to delete project", { id: deletingToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: deletingToast });
    } finally {
      setConfirmId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmId(id);
    setShowConfirm(true);
  };

  const editProject = (p) => {
    setName(p.name);
    setStartDate(p.start_date);
    setEndDate(p.end_date);
    setEditId(p.id);
  };

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Research Projects</h2>
        <p style={styles.subtitle}>Manage and track all ongoing laboratory initiatives.</p>
      </div>

      {/* ADMIN ACTION FORM */}
      {isAdmin && (
        <div className="card" style={styles.formCard}>
          <div style={styles.boxHeader}>
            <FiPlus color="var(--color-accent)" size={20} />
            <h3 style={styles.boxTitle}>{editId ? "Update Project" : "New Project Initiative"}</h3>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Project Name</label>
              <div style={styles.inputWrapper}>
                <FiFolder style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="e.g. Quantum Computing v2"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Start Date</label>
              <div style={styles.inputWrapper}>
                <FiCalendar style={styles.inputIcon} />
                <input
                  type="date"
                  className="input-field"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Estimated End</label>
              <div style={styles.inputWrapper}>
                <FiCalendar style={styles.inputIcon} />
                <input
                  type="date"
                  className="input-field"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={addProject} 
              style={styles.addBtn}
              disabled={saving}
            >
              {saving ? "Processing..." : (editId ? "Update" : "Launch")}
            </button>
          </div>
        </div>
      )}

      {/* PROJECTS TABLE */}
      <div className="card" style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.boxTitle}>Active Initiatives</h3>
          <span style={styles.countBadge}>{projects.length} Total</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Project Details</th>
                <th>Timeline</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} style={styles.tr}>
                    <td style={{ textAlign: "left" }}><Skeleton width="200px" height="24px" /></td>
                    <td><Skeleton width="150px" height="24px" /></td>
                    <td><Skeleton width="80px" height="24px" borderRadius="20px" /></td>
                    {isAdmin && <td style={{ textAlign: "right" }}><Skeleton width="60px" height="24px" /></td>}
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "4" : "3"} style={styles.emptyCell}>
                    <img src="/Folder.png" alt="Empty" style={{ width: "160px", marginBottom: "16px" }} />
                    <p style={{ color: "var(--color-text-dim)" }}>No projects registered in the vault yet.</p>
                  </td>
                </tr>
              ) : (
                projects.slice().reverse().map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={{ textAlign: "left" }}>
                      <div style={styles.projectInfo}>
                        <div style={styles.projectIcon}><FiFolder /></div>
                        <div>
                          <p style={styles.projectName}>{p.name}</p>
                          <p style={styles.projectId}>ID: {p.id.toString().slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={styles.timeline}>
                        <span style={styles.date}>{p.start_date}</span>
                        <span style={styles.dateArrow}>→</span>
                        <span style={styles.date}>{p.end_date}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{
                        ...styles.statusBadge,
                        background: p.status === "Completed" ? "var(--color-success-soft)" : "var(--color-accent-soft)",
                        color: p.status === "Completed" ? "var(--color-success)" : "var(--color-accent)"
                      }}>
                        {p.status}
                      </div>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: "right" }}>
                        <div style={styles.actionGroup}>
                          <button onClick={() => editProject(p)} style={styles.actionBtn}>
                            <FiEdit />
                          </button>
                          <button onClick={() => handleDeleteClick(p.id)} style={{ ...styles.actionBtn, color: "var(--color-danger)" }}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        title="Delete Project?"
        message="This will permanently remove this research initiative from the system. This action cannot be undone."
        onConfirm={deleteProject}
        onCancel={() => setShowConfirm(false)}
        confirmText="Delete Project"
      />
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
  formCard: {
    padding: "24px",
    marginBottom: "32px",
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
  formRow: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-end",
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
  },
  addBtn: {
    height: "48px",
    padding: "0 32px",
    fontWeight: "600",
  },
  tableCard: {
    padding: "24px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  countBadge: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--color-text-dim)",
    background: "var(--color-hover-bg)",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  tr: {
    background: "var(--color-subtle-bg)",
    transition: "background 0.2s ease",
  },
  emptyCell: {
    padding: "60px",
    textAlign: "center",
    color: "var(--color-text-dim)",
  },
  projectInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px 0",
  },
  projectIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "var(--color-subtle-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--color-accent)",
  },
  projectName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  projectId: {
    fontSize: "12px",
    color: "var(--color-text-dim)",
    margin: "2px 0 0 0",
  },
  timeline: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "center",
  },
  date: {
    fontSize: "13px",
    color: "var(--color-text-secondary)",
    fontWeight: "500",
  },
  dateArrow: {
    color: "var(--color-text-dim)",
    fontSize: "12px",
  },
  statusBadge: {
    display: "inline-flex",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionGroup: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  actionBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "var(--color-subtle-bg)",
    border: "none",
    color: "var(--color-text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }
};

export default Projects;