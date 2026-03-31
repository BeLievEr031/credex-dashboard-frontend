import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Modal, message, Typography, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../api/api";

const { Title } = Typography;
const { confirm } = Modal;

interface Product {
    _id: string;
    product: string;
    validity: string;
    credits: string[];
    rateLimit?: string;
    active: boolean;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const navigate = useNavigate();

    const fetchProducts = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await productApi.getProducts({ page, limit });
            setProducts(response.data.products || []);
            setPagination({
                ...pagination,
                current: page,
                total: response.data.pagination?.total || 0,
            });
        } catch (error) {
            console.error("Failed to fetch products", error);
            message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id: string) => {
        confirm({
            title: "Are you sure you want to delete this product?",
            icon: <ExclamationCircleOutlined />,
            content: "This action will deactivate the product.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No",
            async onOk() {
                try {
                    await productApi.deleteProduct(id);
                    message.success("Product deleted successfully");
                    fetchProducts(pagination.current);
                } catch (error) {
                    console.error("Failed to delete product", error);
                    message.error("Failed to delete product");
                }
            },
        });
    };

    const columns = [
        {
            title: "Product Name",
            dataIndex: "product",
            key: "product",
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Validity",
            dataIndex: "validity",
            key: "validity",
            render: (validity: string) => <Tag color="blue">{validity}</Tag>,
        },
        {
            title: "Credits",
            dataIndex: "credits",
            key: "credits",
            render: (credits: string[]) => (
                <Space wrap>
                    {credits.map((c, i) => (
                        <Tag color="cyan" key={i}>{c}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Rate Limit",
            dataIndex: "rateLimit",
            key: "rateLimit",
            render: (limit: string) => limit || "N/A",
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
            title: "Actions",
            key: "actions",
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/products/edit/${record._id}`)}
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
                <Title level={3} className="m-0">Product Management</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/products/create")}
                    size="large"
                >
                    Create Product
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="_id"
                loading={loading}
                pagination={{
                    ...pagination,
                    onChange: (page, pageSize) => fetchProducts(page, pageSize),
                }}
            />
        </Card>
    );
};

export default ProductList;
