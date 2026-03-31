import React, { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";
import { authApi } from "../api/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = (userData: any) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            // Optional: window.location.href = "/login";
        }
    };

    const checkAuth = async () => {
        try {
            const response = await authApi.getProfile();
            if (response.data) {
                // Adjusting to common API response structure
                setUser(response.data.user || response.data);
            }
        } catch (error) {
            console.log("Not authenticated", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
