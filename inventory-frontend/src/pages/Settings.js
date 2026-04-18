import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FiUser, FiTrash2, FiShield, FiUsers, FiSearch, FiMail } from 'react-icons/fi';

function Settings() {
    const { user } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/users', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    setError('Failed to fetch users');
                }
            } catch (err) {
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.token]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`http://localhost:8000/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                const data = await response.json();
                alert(data.detail || 'Delete failed');
            }
        } catch (err) {
            alert('Connection error');
        }
    };

    const filteredUsers = users.filter(u => 
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-transition" style={styles.container}>
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <h2 style={styles.title}>User Management</h2>
                    <p style={styles.subtitle}>Manage system access and review laboratory user accounts.</p>
                </div>
                <div style={styles.statBadge}>
                    <FiUsers size={14} />
                    <span>Total Users: {users.length}</span>
                </div>
            </div>

            <div style={styles.actionBar}>
                <div style={styles.searchWrapper}>
                    <FiSearch style={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.userGrid}>
                {loading ? (
                    <div style={styles.loadingState}>
                        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--color-text-dim)' }}>Loading system users...</p>
                        </div>
                    </div>
                ) : (
                    filteredUsers.map((u) => (
                        <div key={u.id} className="card" style={styles.userCard}>
                            <div style={styles.cardInfo}>
                                <div style={styles.avatar}>
                                    {u.role?.toLowerCase() === 'admin' ? 
                                        <FiShield size={24} color="var(--color-accent)" /> : 
                                        <FiUser size={24} color="var(--color-text-dim)" />
                                    }
                                </div>
                                <div style={styles.details}>
                                    <h4 style={styles.userName}>{u.full_name}</h4>
                                    <div style={styles.emailRow}>
                                        <FiMail size={12} />
                                        <p style={styles.userEmail}>{u.email}</p>
                                    </div>
                                    <div style={{
                                        ...styles.roleTag,
                                        background: u.role?.toLowerCase() === 'admin' ? 'var(--color-accent-soft)' : 'var(--color-subtle-bg)',
                                        color: u.role?.toLowerCase() === 'admin' ? 'var(--color-accent)' : 'var(--color-text-dim)'
                                    }}>
                                        {u.role}
                                    </div>
                                </div>
                            </div>
                            
                            {u.email !== user?.email && (
                                <button 
                                    onClick={() => handleDeleteUser(u.id)}
                                    style={styles.deleteBtn}
                                    title="Delete User"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px 32px',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    titleSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: 'var(--color-text-primary)',
        margin: 0,
    },
    subtitle: {
        fontSize: '14px',
        color: 'var(--color-text-dim)',
    },
    statBadge: {
        background: 'var(--color-hover-bg)',
        color: 'var(--color-text-secondary)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid var(--color-border)',
    },
    actionBar: {
        marginBottom: '24px',
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
    },
    searchIcon: {
        position: 'absolute',
        left: '16px',
        color: 'var(--color-text-dim)',
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px 12px 48px',
        background: 'var(--color-subtle-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        color: 'var(--color-text-primary)',
        fontSize: '14px',
    },
    userGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px'
    },
    userCard: {
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardInfo: {
        display: 'flex',
        gap: '20px'
    },
    avatar: {
        width: '56px',
        height: '56px',
        background: 'var(--color-subtle-bg)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-border)',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    userName: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '700',
        color: 'var(--color-text-primary)'
    },
    emailRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--color-text-dim)',
    },
    userEmail: {
        margin: 0,
        fontSize: '13px',
    },
    roleTag: {
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '4px 10px',
        borderRadius: '20px',
        marginTop: '8px',
        width: 'fit-content'
    },
    deleteBtn: {
        background: 'rgba(239, 68, 68, 0.05)',
        color: 'var(--color-danger)',
        border: 'none',
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    error: {
        background: 'var(--color-danger-soft)',
        color: 'var(--color-danger)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '24px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
    },
    loadingState: {
        gridColumn: '1 / -1',
    }
};

export default Settings;