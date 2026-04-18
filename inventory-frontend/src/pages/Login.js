import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, API_URL } from "../context/AppContext";
import AuthLayout from "../components/AuthLayout";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields");
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userObj = { email: email, role: data.role, token: data.access_token };
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        const msg = typeof data.detail === "string" 
          ? data.detail 
          : (Array.isArray(data.detail) ? data.detail[0].msg : "Invalid credentials");
        setError(msg);
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your credentials to access LabFlow"
      alternativeLink="/register"
      alternativeText="New to LabFlow?"
      image="/Secure-login.png"
    >
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWrapper}>
            <FiMail style={styles.inputIcon} />
            <input
              type="email"
              placeholder="name@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={styles.label}>Password</label>
            <button 
              type="button" 
              onClick={() => navigate("/forgot")}
              style={styles.forgotBtn}
            >
              Forgot?
            </button>
          </div>
          <div style={styles.inputWrapper}>
            <FiLock style={styles.inputIcon} />
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: "44px" }}
            />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ width: "100%", height: "48px", marginTop: "12px" }}
        >
          {loading ? "Signing in..." : (
            <>
              <span>Sign In</span>
              <FiArrowRight />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

const styles = {
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
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
  error: {
    padding: "12px",
    background: "var(--color-danger-soft)",
    color: "var(--color-danger)",
    borderRadius: "12px",
    fontSize: "13px",
    textAlign: "center",
    fontWeight: "500",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  forgotBtn: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--color-accent)",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  }
};

export default Login;