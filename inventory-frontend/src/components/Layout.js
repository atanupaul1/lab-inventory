import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="layout-root" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div className="main-content" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden"
      }}>
        <Navbar />

        <main className="page-container" style={{ 
          padding: "24px", 
          flex: 1,
          animation: "fadeIn 0.4s ease-out"
        }}>
          {children}
        </main>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .layout-root {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;