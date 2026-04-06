import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Typography, Card, Image, Spin, Tag, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { testimonialApi } from "../../api/api";

const { Title } = Typography;
const { confirm } = Modal;

interface Testimonial {
    _id: string;
    feedback: string;
    imageUrl: string;
    publicId: string;
    createdAt: string;
    updatedAt: string;
    type: string;
}

const TestimonialList: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();

    const fetchTestimonials = async (type?: string) => {
        setLoading(true);
        try {
            const params = type && type !== "all" ? { type } : {};
            const response = await testimonialApi.getTestimonials(params);
            setTestimonials(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
            message.error("Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = (id: string, feedback: string) => {
        confirm({
            title: "Are you sure you want to delete this testimonial?",
            icon: <ExclamationCircleOutlined />,
            content: `Feedback: "${feedback.substring(0, 50)}..."`,
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No",
            async onOk() {
                try {
                    await testimonialApi.deleteTestimonial(id);
                    message.success("Testimonial deleted successfully");
                    fetchTestimonials();
                } catch (error) {
                    console.log("Failed to delete testimonial", error);
                    message.error("Failed to delete testimonial");
                }
            },
        });
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 100,
            render: (imageUrl: string) => (
                <Image
                    src={imageUrl}
                    alt="Testimonial"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                />
            ),
        },
        {
            title: "Feedback",
            dataIndex: "feedback",
            key: "feedback",
            ellipsis: true,
            render: (text: string) => (
                <span
                    className="text-gray-700 hover:text-blue-600 cursor-help"
                    title={text}
                >
                    {text.length > 60 ? `${text.substring(0, 60)}...` : text}
                </span>
            ),
        },
        {
            title: "Designation",
            dataIndex: "designation",
            key: "designation",
            width: 150,
            render: (text: string) => (
                <span
                    className="text-gray-700 hover:text-blue-600 cursor-help"
                    title={text}
                >
                    {text && text.length > 60 ? `${text.substring(0, 60)}...` : text}
                </span>
            ),
        },
        {
            title: "Company",
            dataIndex: "company",
            key: "company",
            width: 150,
            render: (text: string) => (
                <span
                    className="text-gray-700 hover:text-blue-600 cursor-help"
                    title={text}
                >
                    {text && text.length > 60 ? `${text.substring(0, 60)}...` : text}
                </span>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type: string) => (
                <Tag color={type === "SELLER" ? "blue" : "purple"}>
                    {type}
                </Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (date: string) => new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 150,
            render: (date: string) => new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            fixed: "right" as const,
            render: (_: any, record: Testimonial) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => navigate(`/testimonials/edit/${record._id}`)}
                        title="Edit testimonial"
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDelete(record._id, record.feedback)}
                        title="Delete testimonial"
                    />
                </Space>
            ),
        },
    ];

    return (
        <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <Title level={3} className="m-0">
                    Testimonial Management
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/testimonials/create")}
                    size="large"
                >
                    Create Testimonial
                </Button>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    fetchTestimonials(key);
                }}
                items={[
                    { key: "all", label: "All Testimonials" },
                    { key: "SELLER", label: "Seller Testimonials" },
                    { key: "BUYER", label: "Buyer Testimonials" },
                ]}
                className="mb-4"
            />

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Spin size="large" tip="Loading testimonials..." />
                </div>
            ) : testimonials.length === 0 ? (
                <div className="h-64 flex items-center justify-center flex-col">
                    <p className="text-gray-500 text-lg mb-4">No testimonials found</p>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate("/testimonials/create")}
                    >
                        Create Your First Testimonial
                    </Button>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={testimonials}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    className="border-t"
                    scroll={{ x: 1200 }}
                />
            )}
        </Card>
    );
};

export default TestimonialList;
