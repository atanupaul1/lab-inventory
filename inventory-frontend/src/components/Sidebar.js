import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

import {
  FiHome,
  FiBox,
  FiBarChart2,
  FiFileText,
  FiSettings,
  FiUser,
  FiAlertTriangle,
  FiClock,
  FiShoppingCart,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function Sidebar() {
  const { user, setUser, mobileOpen, setMobileOpen } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`} style={styles.sidebar}>
      {/* TOP: Logo & Toggle */}
      <div style={styles.topSection}>
        <div style={styles.logoContainer}>
           <div style={styles.logoIcon}>
              <FiBox size={20} color="white" />
           </div>
           {!collapsed && <span style={styles.logoText}>LabFlow</span>}
        </div>
        
        <button style={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* MID: Menu */}
      <nav style={styles.nav}>
        <ul style={styles.menuList}>
          <SidebarItem to="/dashboard" icon={<FiHome />} label="Dashboard" active={isActive("/dashboard")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />

          {user?.role?.toLowerCase() === "admin" && (
            <>
              <div style={styles.sectionTitle}>{!collapsed && "Management"}</div>
              <SidebarItem to="/inventory" icon={<FiBox />} label="Inventory" active={isActive("/inventory")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SidebarItem to="/projects" icon={<FiBarChart2 />} label="Projects" active={isActive("/projects")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SidebarItem to="/reports" icon={<FiFileText />} label="Reports" active={isActive("/reports")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SidebarItem to="/settings" icon={<FiSettings />} label="Users" active={isActive("/settings")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            </>
          )}

          {(user?.role?.toLowerCase() === "student" || user?.role?.toLowerCase() === "user") && (
            <>
               <div style={styles.sectionTitle}>{!collapsed && "Laboratory"}</div>
               <SidebarItem to="/inventory" icon={<FiBox />} label="Inventory" active={isActive("/inventory")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
               <SidebarItem to="/request" icon={<FiShoppingCart />} label="Request" active={isActive("/request")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SidebarItem to="/history" icon={<FiClock />} label="History" active={isActive("/history")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SidebarItem to="/report-issue" icon={<FiAlertTriangle />} label="Report Issue" active={isActive("/report-issue")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
              <SidebarItem to="/profile" icon={<FiUser />} label="Profile" active={isActive("/profile")} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
            </>
          )}
        </ul>
      </nav>

      {/* BOTTOM: User & Logout */}
      <div style={styles.bottomSection}>
        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div style={styles.userInfo}>
              <p style={styles.userName}>{user?.email?.split('@')[0]}</p>
              <span style={styles.userRole}>{user?.role}</span>
            </div>
          )}
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut size={18} />
          {!collapsed && <span style={{ marginLeft: "12px" }}>Sign Out</span>}
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          transition: width var(--transition-normal);
          background-color: var(--color-bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -100%;
            z-index: 1000;
          }
          .sidebar.mobile-open {
            left: 0;
            width: 280px !important;
          }
        }
      `}</style>
    </aside>
  );
}

function SidebarItem({ to, icon, label, active, collapsed, onClick }) {
  return (
    <li style={{ listStyle: "none" }}>
      <Link
        to={to}
        onClick={onClick}
        title={collapsed ? label : ""}
        style={{
          ...styles.link,
          ...(active ? styles.activeLink : {}),
          justifyContent: collapsed ? "center" : "flex-start"
        }}
      >
        <span style={{...styles.icon, color: active ? "white" : "inherit"}}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );
}

const styles = {
  sidebar: {
    padding: "20px 12px",
  },
  topSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
    padding: "0 8px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    background: "var(--color-accent)",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px var(--color-accent-soft)",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    color: "var(--color-text-primary)",
  },
  toggleBtn: {
    color: "var(--color-text-secondary)",
    fontSize: "18px",
    padding: "4px",
    borderRadius: "6px",
    background: "var(--color-subtle-bg)",
  },
  nav: {
    flex: 1,
    overflowY: "auto",
  },
  menuList: {
    padding: 0,
    margin: 0,
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "var(--color-text-dim)",
    margin: "24px 12px 12px",
    letterSpacing: "1px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    margin: "4px 0",
    borderRadius: "12px",
    color: "var(--color-text-secondary)",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all var(--transition-fast)",
  },
  activeLink: {
    backgroundColor: "var(--color-accent)",
    color: "white",
    boxShadow: "0 4px 12px var(--color-accent-soft)",
  },
  icon: {
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
  },
  bottomSection: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid var(--border-color)",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 8px",
    marginBottom: "12px",
    background: "var(--color-subtle-bg)",
    borderRadius: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "var(--color-bg-surface)",
    color: "var(--color-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    border: "1px solid var(--border-color)",
  },
  userInfo: {
    overflow: "hidden",
  },
  userName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: "11px",
    color: "var(--color-text-dim)",
    textTransform: "capitalize",
  },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(239, 68, 68, 0.08)",
    color: "var(--color-danger)",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all var(--transition-fast)",
  },
};

export default Sidebar;