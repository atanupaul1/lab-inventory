import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FiSun, FiMoon } from "react-icons/fi";

function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(AppContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={styles.toggle}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div style={{
        ...styles.iconWrapper,
        transform: darkMode ? "rotate(0deg)" : "rotate(180deg)",
        background: "var(--color-hover-bg)"
      }}>
        {darkMode ? (
          <FiSun size={20} color="var(--color-warning)" />
        ) : (
          <FiMoon size={20} color="var(--color-accent)" />
        )}
      </div>
    </button>
  );
}

const styles = {
  toggle: {
    padding: "8px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  iconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid var(--color-border)",
  }
};

export default ThemeToggle;
