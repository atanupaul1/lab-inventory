import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../context/AppContext";
import AuthLayout from "../components/AuthLayout";
import { FiMail, FiLock, FiCheckCircle, FiArrowRight, FiShield } from "react-icons/fi";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_URL}/forgot-password`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setMessage("OTP sent to your email!");
      } else {
        const msg = typeof data.detail === "string" ? data.detail : (Array.isArray(data.detail) ? data.detail[0].msg : "User not found");
        setError(msg);
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter OTP");
    setLoading(true);
    setError("");

    // The backend doesn't have a separate /verify-otp-forgot endpoint in the current main.py
    // It seems reset-password handles both. Let's check main.py again.
    // Wait, I see reset_password in main.py uses schemas.ResetPassword which has email, otp_code, new_password.
    // So there's no intermediate verify step in the backend?
    // Let's check main.py for any verify endpoint.
    
    // Actually, I'll just skip to step 3 in the UI if the user enters anything, 
    // and let the final reset call do the verification.
    setStep(3);
    setMessage("Please set your new password.");
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return setError("Please enter new password");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/reset-password`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otp, new_password: newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        const msg = typeof data.detail === "string" ? data.detail : (Array.isArray(data.detail) ? data.detail[0].msg : "Failed to reset password");
        setError(msg);
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Forgot Password?" : step === 2 ? "Verify OTP" : "Reset Password"} 
      subtitle={
        step === 1 ? "Don't worry, we'll help you reset it." : 
        step === 2 ? `Enter the code sent to ${email}` : 
        "Choose a strong new password."
      }
      alternativeLink="/"
      alternativeText="Remembered password?"
      image="/Data-security.png"
    >
      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {step === 1 && (
        <form onSubmit={handleRequestOTP} style={styles.form}>
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
          <button type="submit" className="btn-primary" disabled={loading} style={styles.submitBtn}>
            {loading ? "Sending..." : "Send Reset Code"}
            <FiArrowRight />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>OTP Code</label>
            <div style={styles.inputWrapper}>
              <FiShield style={styles.inputIcon} />
              <input
                type="text"
                placeholder="000000"
                className="input-field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ paddingLeft: "44px", textAlign: "center", fontWeight: "bold" }}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={styles.submitBtn}>
            Next Step
            <FiArrowRight />
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingLeft: "44px" }}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={styles.submitBtn}>
            {loading ? "Resetting..." : "Reset Password"}
            <FiCheckCircle />
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
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
  submitBtn: {
    width: "100%",
    height: "48px",
    marginTop: "12px",
    gap: "10px",
  },
  error: {
    padding: "12px",
    background: "var(--color-danger-soft)",
    color: "var(--color-danger)",
    borderRadius: "12px",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "16px",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  success: {
    padding: "12px",
    background: "var(--color-success-soft)",
    color: "var(--color-success)",
    borderRadius: "12px",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "16px",
    border: "1px solid rgba(34, 197, 94, 0.2)",
  },
};

export default ForgotPassword;