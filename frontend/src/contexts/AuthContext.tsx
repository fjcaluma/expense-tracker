import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getToken, setToken, removeToken } from '../utils/auth';
import { authApi } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = getToken();
        if (token) {
            // In a real app, validate the token with the backend
            // For now, just trust it exists
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        setToken(response.token);
        setUser(response.user);
    };

    const signup = async (email: string, password: string) => {
        const response = await authApi.signup(email, password);
        setToken(response.token);
        setUser(response.user);
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};