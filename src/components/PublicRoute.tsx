import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spin } from "antd";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spin size="large" tip="Checking authentication..." />
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to dashboard if already logged in
        // If there was a 'from' location, we could use it, but usually we just go to /
        const from = (location.state as any)?.from?.pathname || "/";
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
