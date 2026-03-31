import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Modal, message, Typography, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { blogApi } from "../../api/api";

const { Title } = Typography;
const { confirm } = Modal;

interface Blog {
    _id: string;
    title: string;
    slug: string;
    active: boolean;
    createdAt: string;
}

const BlogList: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const navigate = useNavigate();

    const fetchBlogs = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await blogApi.getBlogs({ page, limit });
            // Adapt to API response structure (checking backend/src/module/Blog/BlogService.ts:92)
            setBlogs(response.data.blogs || []);
            setPagination({
                ...pagination,
                current: page,
                total: response.data.pagination?.total || 0,
            });
        } catch (error) {
            console.error("Failed to fetch blogs", error);
            message.error("Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = (id: string) => {
        confirm({
            title: "Are you sure you want to delete this blog?",
            icon: <ExclamationCircleOutlined />,
            content: "This action will deactivate the blog.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No",
            async onOk() {
                try {
                    await blogApi.deleteBlog(id);
                    message.success("Blog deleted successfully");
                    fetchBlogs(pagination.current);
                } catch (error) {
                    console.log("Failed to delete blog", error);
                    message.error("Failed to delete blog");
                }
            },
        });
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            render: (slug: string) => <Tag color="blue">{slug}</Tag>,
        },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            render: (active: boolean) => (
                <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Blog) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/blogs/edit/${record._id}`)}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <Title level={3} className="m-0">Blog Management</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/blogs/create")}
                    size="large"
                >
                    Create Blog
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={blogs}
                rowKey="_id"
                loading={loading}
                pagination={{
                    ...pagination,
                    onChange: (page, pageSize) => fetchBlogs(page, pageSize),
                }}
                className="border-t"
            />
        </Card>
    );
};

export default BlogList;
