export interface User {
    id: string;
    email: string;
    created_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Expense {
    id: string;
    user_id: string;
    amount: string;
    category: string;
    description: string | null;
    date: string;
    created_at: string;
}

export interface ExpenseInput {
    amount: number;
    category: string;
    description?: string;
    date: string;
}

export interface CategorySummary {
    category: string;
    total: string;
}

export interface ApiError {
    error: string;
}