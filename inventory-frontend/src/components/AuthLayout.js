import { FiBox } from "react-icons/fi";
import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle, alternativeLink, alternativeText, image }) {
  return (
    <div style={styles.container}>
      {/* Background Decor */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div className="glass" style={styles.authBox}>
        {image && (
          <div style={styles.illustrationWrapper}>
            <img src={image} alt="Auth Illustration" style={styles.illustration} />
          </div>
        )}
        <div style={styles.header}>
          <div style={styles.logoIcon}>
            <FiBox size={24} color="white" />
          </div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>

        <div style={styles.formContent}>
          {children}
        </div>

        {alternativeLink && (
          <div style={styles.footer}>
            <span style={{ color: "var(--color-text-secondary)" }}>{alternativeText} </span>
            <Link to={alternativeLink} style={styles.link}>
              {alternativeLink === "/register" ? "Create Account" : "Sign In"}
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--color-bg-primary)",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  blob1: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "40%",
    height: "60%",
    background: "radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)",
    filter: "blur(60px)",
    animation: "rotate 20s linear infinite",
  },
  blob2: {
    position: "absolute",
    bottom: "-10%",
    right: "-10%",
    width: "40%",
    height: "60%",
    background: "radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)",
    filter: "blur(60px)",
    animation: "rotate 25s linear infinite reverse",
  },
  authBox: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    borderRadius: "24px",
    zIndex: 1,
    overflow: "hidden",
  },
  illustrationWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  illustration: {
    width: "180px",
    height: "auto",
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    background: "var(--color-accent)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 8px 16px var(--color-accent-soft)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "8px",
    color: "var(--color-text-primary)",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--color-text-secondary)",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  footer: {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "var(--color-accent)",
    fontWeight: "600",
    marginLeft: "4px",
  },
};

export default AuthLayout;
