import { createContext, useState, useEffect, useCallback } from "react";

export const AppContext = createContext();
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function AppProvider({ children }) {
  // 🔥 USER (AUTHENTICATION)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // 📡 FETCH DATA FROM API
  const fetchData = useCallback(async () => {
    if (!user || !user.token) return;
    
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      
      // Fetch all in parallel
      const [itemsRes, projectsRes, requestsRes, issuesRes] = await Promise.all([
        fetch(`${API_URL}/items`),
        fetch(`${API_URL}/projects`),
        fetch(user.role.toLowerCase() === 'admin' ? `${API_URL}/requests` : `${API_URL}/requests/me`, { headers }),
        fetch(`${API_URL}/issues`, { headers })
      ]);

      if (itemsRes.ok) setItems(await itemsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (requestsRes.ok) setRequests(await requestsRes.json());
      if (issuesRes.ok) setIssues(await issuesRes.json());

    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch on mount or user change
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Clear data on logout
      setItems([]);
      setProjects([]);
      setRequests([]);
      setIssues([]);
    }
  }, [user, fetchData]);

  // 💾 PERSIST AUTH & THEME
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        items,
        setItems,
        projects,
        setProjects,
        requests,
        setRequests,
        issues,
        setIssues,
        searchTerm,
        setSearchTerm,
        darkMode,
        setDarkMode,
        mobileOpen,
        setMobileOpen,
        refreshData: fetchData,
        loading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;