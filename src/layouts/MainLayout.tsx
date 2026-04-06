import React, { useState } from "react";
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    FileTextOutlined,
    ShoppingOutlined,
    UserOutlined,
    LogoutOutlined,
    MessageOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: "/",
            icon: <DashboardOutlined />,
            label: "Dashboard",
        },
        {
            key: "/blogs",
            icon: <FileTextOutlined />,
            label: "Blogs",
        },
        {
            key: "/products",
            icon: <ShoppingOutlined />,
            label: "Products",
        },
        {
            key: "/testimonials",
            icon: <MessageOutlined />,
            label: "Testimonials",
        },
        {
            key: "/newsletter",
            icon: <MailOutlined />,
            label: "Newsletter",
        },
        {
            key: "/profile",
            icon: <UserOutlined />,
            label: "Profile",
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    const userMenuItems = [
        {
            key: "/profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => navigate("/profile"),
        },
        {
            type: "divider" as const,
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: logout,
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-md">
                <div className="p-4 text-center">
                    <h2 className={`font-bold text-blue-600 truncate ${collapsed ? "text-xl" : "text-2xl"}`}>
                        {collapsed ? "C" : "Credex"}
                    </h2>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    className="border-none mt-4"
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingRight: "24px",
                    }}
                    className="shadow-sm z-10"
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                        <Space className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
                            <Avatar icon={<UserOutlined />} className="bg-blue-600" />
                            <span className="font-medium text-gray-700">{user?.name}</span>
                        </Space>
                    </Dropdown>
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflowY: "auto",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
