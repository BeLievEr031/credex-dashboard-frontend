import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography, Spin, message } from "antd";
import { FileTextOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi } from "../../api/api";

const { Title } = Typography;

const DashboardHome: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalBlogs: 0, totalProducts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardApi.getStats();
                setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                message.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Spin size="large" tip="Loading dashboard stats..." />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <Title level={4} className="m-0 text-gray-500">Welcome back,</Title>
                <Title level={2} className="m-0 font-bold">{user?.name}!</Title>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Total Blogs"
                            value={stats.totalBlogs}
                            prefix={<FileTextOutlined className="text-blue-600 mr-2" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Active Products"
                            value={stats.totalProducts}
                            prefix={<ShoppingOutlined className="text-green-600 mr-2" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="User Profile"
                            value="Active"
                            prefix={<UserOutlined className="text-orange-600 mr-2" />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Recent Activity" className="mt-8 shadow-sm">
                <p className="text-gray-500 italic">No recent activity to display.</p>
            </Card>
        </div>
    );
};

export default DashboardHome;
