import { useState, useContext } from "react";
import { AppContext, API_URL } from "../context/AppContext";
import { FiTrash2, FiPlus, FiBox, FiSearch, FiTag, FiDollarSign, FiMaximize2, FiMapPin, FiCalendar, FiCpu } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import ConfirmModal from "../components/ConfirmModal";
import QRModal from "../components/QRModal";

function Inventory() {
  const { items, user, refreshData, searchTerm, setSearchTerm, loading } = useContext(AppContext);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Component");
  const [assetId, setAssetId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState("Main Lab");
  const [adding, setAdding] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const [showQR, setShowQR] = useState(false);
  const [qrItem, setQrItem] = useState(null);

  const addItem = async () => {
    if (!name || !quantity || !price) return toast.error("Please fill in all required fields");

    setAdding(true);
    const loadingToast = toast.loading("Adding asset...");
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          name, 
          quantity: Number(quantity), 
          price: Number(price), 
          category,
          asset_id: assetId,
          purchase_date: purchaseDate,
          location: location
        }),
      });

      if (response.ok) {
        toast.success(`${name} registered successfully!`, { id: loadingToast });
        setName("");
        setQuantity("");
        setPrice("");
        setAssetId("");
        setLocation("Main Lab");
        refreshData();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to add item", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: loadingToast });
    } finally {
      setAdding(false);
    }
  };

  const removeItem = async () => {
    if (!confirmId) return;
    
    setShowConfirm(false);
    const deletingToast = toast.loading("Removing asset...");
    try {
      const response = await fetch(`${API_URL}/items/${confirmId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        toast.success("Asset removed from inventory", { id: deletingToast });
        refreshData();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to delete item", { id: deletingToast });
      }
    } catch (err) {
      toast.error("Server connection failed", { id: deletingToast });
    } finally {
      setConfirmId(null);
    }
  };

  const handleRemoveClick = (id) => {
    setConfirmId(id);
    setShowConfirm(true);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-transition" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Inventory Vault</h2>
        <p style={styles.subtitle}>Track and manage laboratory equipment and components.</p>
      </div>

      {/* ADD ITEM FORM */}
      {isAdmin && (
        <div className="card" style={styles.formCard}>
          <div style={styles.boxHeader}>
            <FiPlus color="var(--color-accent)" size={20} />
            <h3 style={styles.boxTitle}>Register New Asset</h3>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Asset Name</label>
              <div style={styles.inputWrapper}>
                <FiBox style={styles.inputIcon} />
                <input
                  placeholder="e.g. Oscilloscope"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Initial Stock</label>
              <div style={styles.inputWrapper}>
                <FiTag style={styles.inputIcon} />
                <input
                  type="number"
                  placeholder="0"
                  className="input-field"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Unit Price ($)</label>
              <div style={styles.inputWrapper}>
                <FiDollarSign style={styles.inputIcon} />
                <input
                  type="number"
                  placeholder="0.00"
                  className="input-field"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Component">Component</option>
                <option value="Equipment">Equipment</option>
                <option value="Material">Material</option>
                <option value="Tool">Tool</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Asset ID</label>
              <div style={styles.inputWrapper}>
                <FiCpu style={styles.inputIcon} />
                <input
                  placeholder="LAB-XXX-2024"
                  className="input-field"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Purchase Date</label>
              <div style={styles.inputWrapper}>
                <FiCalendar style={styles.inputIcon} />
                <input
                  type="date"
                  className="input-field"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Storage Location</label>
              <div style={styles.inputWrapper}>
                <FiMapPin style={styles.inputIcon} />
                <select
                  className="input-field"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                >
                  <option value="Main Lab">Main Lab</option>
                  <option value="Research Wing">Research Wing</option>
                  <option value="Hardware Store">Hardware Store</option>
                  <option value="Electronics Bay">Electronics Bay</option>
                </select>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={addItem} 
              style={styles.addBtn}
              disabled={adding}
            >
              <FiPlus />
              <span>{adding ? "Adding..." : "Add Asset"}</span>
            </button>
          </div>
        </div>
      )}

      {/* INVENTORY LIST */}
      <div style={styles.listSection}>
        <div style={styles.listHeader}>
          <h3 style={styles.boxTitle}>Asset Catalog</h3>
          <div style={styles.searchWrapper}>
            <FiSearch style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.grid}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card" style={styles.itemCard}>
                <Skeleton width="48px" height="48px" borderRadius="14px" />
                <Skeleton width="70%" height="24px" margin="12px 0 0 0" />
                <Skeleton width="40%" height="20px" borderRadius="20px" />
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
                  <Skeleton width="100%" height="20px" />
                </div>
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="card" style={styles.emptyState}>
              <img src="/cloud-storage.png" alt="Empty" style={{ width: "180px", marginBottom: "20px" }} />
              <p style={{ color: "var(--color-text-dim)" }}>Your inventory is currently empty.</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="card" style={styles.emptyState}>
              <img src="/No-results-found.png" alt="Not found" style={{ width: "180px", marginBottom: "20px" }} />
              <p style={{ color: "var(--color-text-dim)" }}>No assets found matching your search.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="card" style={styles.itemCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.itemIconBox}>
                    <FiBox size={24} color="var(--color-accent)" />
                  </div>
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => { setQrItem(item); setShowQR(true); }} 
                      style={{...styles.actionBtn, color: "var(--color-accent)"}}
                      title="View QR Code"
                    >
                      <FiMaximize2 size={16} />
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleRemoveClick(item.id)} 
                        style={{...styles.actionBtn, color: "var(--color-danger)"}}
                        title="Remove Asset"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <h4 style={styles.itemName}>{item.name}</h4>
                <div style={styles.categoryBadge}>{item.category || "General"}</div>
                
                <div style={styles.stockInfo}>
                  <div style={styles.stockColumn}>
                    <span style={styles.stockLabel}>Stock</span>
                    <span style={{
                      ...styles.stockValue,
                      color: item.quantity < 5 ? "var(--color-danger)" : "var(--color-text-primary)"
                    }}>
                      {item.quantity} units
                    </span>
                  </div>
                  <div style={styles.stockColumn}>
                    <span style={styles.stockLabel}>Price</span>
                    <span style={styles.stockValue}>${item.price?.toFixed(2)}</span>
                  </div>
                </div>

                <div style={styles.detailList}>
                  <div style={styles.detailItem}>
                    <FiMapPin size={12} />
                    <span>{item.location || "N/A"}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <FiCpu size={12} />
                    <span>{item.asset_id || "No ID"}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <FiCalendar size={12} />
                    <span>{item.purchase_date || "Unknown"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        title="Remove Asset?"
        message="This will permanently delete this item from the laboratory inventory. This action cannot be undone."
        onConfirm={removeItem}
        onCancel={() => setShowConfirm(false)}
        confirmText="Remove Asset"
      />

      <QRModal 
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        item={qrItem}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 32px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--color-text-dim)",
    marginTop: "4px",
  },
  formCard: {
    padding: "24px",
    marginBottom: "40px",
  },
  boxHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  boxTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--color-text-primary)",
    margin: 0,
  },
  formRow: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    minWidth: "150px",
  },
  label: {
    fontSize: "13px",
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
    pointerEvents: "none",
  },
  addBtn: {
    height: "48px",
    padding: "0 24px",
    gap: "10px",
    marginBottom: "2px",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "300px",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    color: "var(--color-text-dim)",
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px 10px 40px",
    background: "var(--color-subtle-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "10px",
    color: "var(--color-text-primary)",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  itemCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "rgba(20, 184, 166, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(20, 184, 166, 0.1)",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  actionBtn: {
    background: "var(--color-hover-bg)",
    border: "1px solid var(--color-subtle-border)",
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  itemName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
    margin: "8px 0 0 0",
  },
  categoryBadge: {
    width: "fit-content",
    padding: "4px 10px",
    borderRadius: "20px",
    background: "var(--color-hover-bg)",
    color: "var(--color-text-secondary)",
    fontSize: "12px",
    fontWeight: "600",
  },
  stockInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid var(--color-border)",
  },
  stockColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  stockLabel: {
    fontSize: "11px",
    color: "var(--color-text-dim)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stockValue: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--color-text-primary)",
  },
  detailList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid var(--color-border)",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "12px",
    color: "var(--color-text-dim)",
  },
  emptyState: {
    gridColumn: "1 / -1",
    padding: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }
};

export default Inventory;