import axios from 'axios';
import { AuthResponse, Expense, ExpenseInput, CategorySummary } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authApi = {
    signup: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/signup', { email, password });
        return response.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    },
};

// Expenses API
export const expensesApi = {
    getAll: async (): Promise<Expense[]> => {
        const response = await api.get<Expense[]>('/expenses');
        return response.data;
    },

    create: async (data: ExpenseInput): Promise<Expense> => {
        const response = await api.post<Expense>('/expenses', data);
        return response.data;
    },

    update: async (id: string, data: ExpenseInput): Promise<Expense> => {
        const response = await api.put<Expense>(`/expenses/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },

    getSummary: async (): Promise<CategorySummary[]> => {
        const response = await api.get<CategorySummary[]>('/expenses/summary');
        return response.data;
    },
};

export default api;