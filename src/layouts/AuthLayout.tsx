import React from "react";
import { Typography } from "antd";
import { Outlet } from "react-router-dom";

const { Title } = Typography;

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <Title level={2} className="text-blue-600 font-bold m-0" style={{ margin: 0 }}>Credex</Title>
                    <p className="text-gray-500 mt-2">Sign in to manage your platform</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
