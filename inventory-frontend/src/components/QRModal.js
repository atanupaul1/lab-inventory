import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiPrinter, FiDownload } from 'react-icons/fi';

const QRModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const downloadQR = () => {
    const svg = document.getElementById("item-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${item.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div style={styles.overlay}>
      <div className="card page-transition" style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Asset QR Code</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div style={styles.qrContainer}>
          <div style={styles.qrWrapper}>
            <QRCodeSVG 
              id="item-qr"
              value={`LABFLOW:${item.id}:${item.name}`} 
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#0f172a"}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <div style={styles.info}>
            <h4 style={styles.itemName}>{item.name}</h4>
            <p style={styles.itemId}>UID: {item.id}</p>
          </div>
        </div>

        <div style={styles.actions}>
          <button className="btn-ghost" onClick={() => window.print()} style={{ flex: 1 }}>
            <FiPrinter /> Print
          </button>
          <button className="btn-primary" onClick={downloadQR} style={{ flex: 1 }}>
            <FiDownload /> Download
          </button>
        </div>
      </div>
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
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(12px)",
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
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--color-text-dim)",
    cursor: "pointer",
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  qrWrapper: {
    padding: "16px",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  info: {
    textAlign: "center",
  },
  itemName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: "0 0 4px 0",
  },
  itemId: {
    fontSize: "13px",
    color: "var(--color-text-dim)",
    margin: 0,
    fontFamily: "monospace",
  },
  actions: {
    display: "flex",
    gap: "12px",
    width: "100%",
  }
};

export default QRModal;
