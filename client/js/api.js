const API_URL = 'http://localhost:3000/api';

class API {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
    };

    if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

  // Auth endpoints
async register(userData) {
    return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

async login(email, password) {
    return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

  // Account endpoints
async getAccounts() {
    return this.request('/accounts');
}

  // Transaction endpoints
async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/transactions?${query}`);
}

async syncTransactions() {
    return this.request('/transactions/sync', { method: 'POST' });
}

async getAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/transactions/analytics?${query}`);
}

  // Insight endpoints
async getInsights(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/insights?${query}`);
}

async generateInsights() {
    return this.request('/insights/generate', { method: 'POST' });
}

async markInsightAsRead(insightId) {
    return this.request(`/insights/${insightId}/read`, { method: 'PATCH' });
}

  // Goal endpoints
async getGoals() {
    return this.request('/goals');
}

async createGoal(goalData) {
    return this.request('/goals', {
        method: 'POST',
        body: JSON.stringify(goalData)
    });
}

async getGoalForecast(goalId) {
    return this.request(`/goals/${goalId}/forecast`);
}

async updateGoal(goalId, updates) {
    return this.request(`/goals/${goalId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
    });
}

async deleteGoal(goalId) {
    return this.request(`/goals/${goalId}`, { method: 'DELETE' });
}

  // Subscription endpoints
async getSubscriptions() {
    return this.request('/subscriptions');
}

async scanSubscriptions() {
        return this.request('/subscriptions/scan', { method: 'POST' });
    }
}

const api = new API();