const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = {
    async login(email, password) {
        const response = await fetch(`${API_URL}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name: "", role: "Student" }) // Role is optional in backend if just checking token
        });
        if (!response.ok) throw new Error("Login failed");
        return response.json();
    },

    async register(name, email, password, role = "Student") {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: name, email, password, role })
        });
        if (!response.ok) throw new Error("Registration failed");
        return response.json();
    },

    async getItems() {
        const response = await fetch(`${API_URL}/items`);
        return response.json();
    },

    async createRequest(requestId, token) {
        // ... implementation as needed
    },

    // Add more helper methods here
};

export default api;
