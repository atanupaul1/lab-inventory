import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
  if (!isOpen) return null;

  const accentColor = type === "danger" ? "var(--color-danger)" : "var(--color-accent)";
  const accentSoft = type === "danger" ? "var(--color-danger-soft)" : "var(--color-accent-soft)";

  return (
    <div style={styles.overlay}>
      <div className="card page-transition" style={styles.modal}>
        <button style={styles.closeBtn} onClick={onCancel}>
          <FiX size={20} />
        </button>

        <div style={{...styles.iconWrapper, background: accentSoft, color: accentColor}}>
          <FiAlertTriangle size={24} />
        </div>

        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>

        <div style={styles.actions}>
          <button className="btn-ghost" onClick={onCancel} style={{ flex: 1 }}>
            {cancelText}
          </button>
          <button 
            className="btn-primary" 
            onClick={onConfirm} 
            style={{ 
              flex: 1, 
              background: type === "danger" ? "var(--color-danger)" : "var(--color-accent)",
              border: "none" 
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    animation: "fadeIn 0.2s ease-out",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    color: "var(--color-text-dim)",
    cursor: "pointer",
  },
  iconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: "0 0 12px 0",
  },
  message: {
    fontSize: "14px",
    color: "var(--color-text-dim)",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
  actions: {
    display: "flex",
    gap: "12px",
    width: "100%",
  }
};

export default ConfirmModal;
