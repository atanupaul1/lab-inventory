import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { FiSearch, FiBell, FiPlus, FiChevronRight, FiShoppingCart, FiAlertTriangle, FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, requests, issues, searchTerm, setSearchTerm, mobileOpen, setMobileOpen } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (location.pathname !== "/inventory" && e.target.value.length > 0) {
      navigate("/inventory");
    }
  };
  const dropdownRef = useRef(null);

  const handleNewOrder = () => {
    if (!user) return navigate("/");
    if (user.role === "student") {
      navigate("/request");
    } else {
      navigate("/inventory");
    }
  };

  const pendingRequests = requests.filter(r => r.status === "Pending");
  const pendingIssues = issues.filter(i => i.status === "Pending");
  const totalNotifications = pendingRequests.length + pendingIssues.length;

  const getPageTitle = () => {
    const path = location.pathname.split("/")[1];
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Overview";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="glass" style={styles.nav}>
      {/* LEFT: Breadcrumbs */}
      <div style={styles.left}>
        <button className="mobile-menu-btn" style={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <div style={styles.breadcrumb}>
           <span style={{ color: "var(--color-text-dim)" }}>Pages</span>
           <FiChevronRight size={14} color="var(--color-text-dim)" />
           <span style={{ fontWeight: "600" }}>{getPageTitle()}</span>
        </div>
      </div>

      {/* RIGHT: Search & Actions */}
      <div style={styles.right}>
        <div className="search-box" style={styles.searchBox}>
          <FiSearch color="var(--color-text-dim)" size={18} />
          <input 
            className="search-input" 
            style={styles.searchInput} 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div style={styles.actions}>
           <ThemeToggle />
           <div style={{ position: "relative" }} ref={dropdownRef}>
              <button style={styles.actionBtn} onClick={() => setOpen(!open)}>
                <FiBell size={20} />
                {totalNotifications > 0 && (
                  <span style={styles.badge}>{totalNotifications}</span>
                )}
              </button>

              {open && (
                <div className="card" style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <h4 style={{ margin: 0 }}>Notifications</h4>
                    <span style={{ fontSize: "11px", color: "var(--color-accent)" }}>Clear all</span>
                  </div>
                  <div style={styles.dropdownBody}>
                    {totalNotifications === 0 ? (
                      <p style={styles.emptyText}>No new notifications</p>
                    ) : (
                      <>
                        {pendingRequests.map(r => (
                          <div key={r.id} style={styles.notiItem}>
                            <div style={styles.notiIcon}><FiShoppingCart size={14} /></div>
                            <div>
                               <p style={styles.notiTitle}>New Request: {r.item?.name || "Hardware"}</p>
                               <span style={styles.notiTime}>Just now</span>
                            </div>
                          </div>
                        ))}
                        {pendingIssues.map(i => (
                          <div key={i.id} style={styles.notiItem}>
                            <div style={{...styles.notiIcon, background: "var(--color-danger-soft)", color: "var(--color-danger)"}}>
                               <FiAlertTriangle size={14} />
                            </div>
                            <div>
                               <p style={styles.notiTitle}>Issue: {i.text}</p>
                               <span style={styles.notiTime}>Recently</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
           </div>

           <button className="btn-primary" onClick={handleNewOrder}>
             <FiPlus size={18} />
             <span>{user?.role === "admin" ? "Add Item" : "Issue Hardware"}</span>
           </button>
        </div>
      </div>

      <style>{`
        .search-box:focus-within {
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 2px var(--color-accent-soft);
        }
        @media (max-width: 768px) {
          .menu-btn-container { display: block; }
          .search-box { display: none !important; }
          .btn-primary span { display: none; }
          .btn-primary { padding: 10px; border-radius: 50%; width: 44px; height: 44px; justify-content: center; }
          .navbar-actions { gap: 10px !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "var(--navbar-height)",
    padding: "0 30px",
    background: "var(--color-bg-primary)",
    opacity: 0.9,
    borderBottom: "1px solid var(--border-color)",
    position: "sticky",
    top: 0,
    zIndex: 99,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "var(--color-bg-secondary)",
    padding: "8px 16px",
    borderRadius: "var(--border-radius-full)",
    width: "280px",
    gap: "10px",
    border: "1px solid var(--border-color)",
    transition: "all var(--transition-fast)",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    color: "var(--color-text-primary)",
    fontSize: "14px",
    width: "100%",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--color-text-secondary)",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "var(--color-danger)",
    color: "white",
    fontSize: "10px",
    fontWeight: "700",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--color-bg-primary)",
  },
  dropdown: {
    position: "absolute",
    top: "50px",
    right: "0",
    width: "300px",
    padding: "16px",
    zIndex: 100,
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border-color)",
  },
  dropdownBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  emptyText: {
    textAlign: "center",
    color: "var(--color-text-dim)",
    fontSize: "13px",
    margin: "12px 0",
  },
  notiItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  notiIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "var(--color-accent-soft)",
    color: "var(--color-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notiTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "500",
  },
  notiTime: {
    fontSize: "11px",
    color: "var(--color-text-dim)",
  },
  menuBtn: {
    display: "none",
    marginRight: "16px",
    color: "var(--color-text-primary)",
  },
};

export default Navbar;