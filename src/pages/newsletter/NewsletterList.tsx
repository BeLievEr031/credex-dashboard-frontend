import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Typography, Card, Tag, Spin } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { newsletterApi } from "../../api/api";

const { Title } = Typography;

interface Subscriber {
    _id: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

const NewsletterList: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchSubscribers = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await newsletterApi.getSubscribers({ page, limit });
            const { subscribers, pagination: resPager } = response.data;
            setSubscribers(subscribers || []);
            setPagination({
                current: resPager.page,
                pageSize: resPager.limit,
                total: resPager.total,
            });
        } catch (error) {
            console.error("Failed to fetch subscribers", error);
            message.error("Failed to load newsletter subscribers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleTableChange = (nav: any) => {
        fetchSubscribers(nav.current, nav.pageSize);
    };

    const exportToCSV = () => {
        if (subscribers.length === 0) {
            message.warning("No subscribers to export");
            return;
        }

        const headers = ["Email", "Status", "Subscribed At"];
        const csvContent = [
            headers.join(","),
            ...subscribers.map(s => [
                s.email,
                s.active ? "Active" : "Inactive",
                new Date(s.createdAt).toLocaleString()
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: true,
            render: (email: string) => <span className="font-medium">{email}</span>,
        },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            width: 120,
            render: (active: boolean) => (
                <Tag color={active ? "green" : "red"}>
                    {active ? "ACTIVE" : "INACTIVE"}
                </Tag>
            ),
        },
        {
            title: "Subscribed At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
            render: (date: string) => new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        },
    ];

    return (
        <Card className="shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <Title level={3} className="m-0">
                        Newsletter Subscribers
                    </Title>
                    <p className="text-gray-500 m-0">Manage and export your newsletter email list</p>
                </div>
                <Space>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => fetchSubscribers(pagination.current, pagination.pageSize)}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={exportToCSV}
                        disabled={loading || subscribers.length === 0}
                    >
                        Export CSV
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={subscribers}
                rowKey="_id"
                loading={loading}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} subscribers`,
                }}
                onChange={handleTableChange}
                className="border-t"
            />
        </Card>
    );
};

export default NewsletterList;
