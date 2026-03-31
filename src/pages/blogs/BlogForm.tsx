import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin, Typography, Switch } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { blogApi } from "../../api/api";

const { Title } = Typography;
const { TextArea } = Input;

const BlogForm: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            const fetchBlog = async () => {
                try {
                    const response = await blogApi.getBlog(id as string); // Assuming search by ID or slug works
                    // Note: If /api/blog/slug/:slug is the only way, we might need to adjust logic
                    // or use a separate /api/blog/:id if it exists.
                    // Based on BlogService.ts, getBySlug(slug) exists.
                    const blog = response.data.data;
                    form.setFieldsValue({
                        title: blog.title,
                        slug: blog.slug,
                        bannerImgUrl: blog.bannerImgUrl,
                        blogJSONData: JSON.stringify(blog.blogJSONData, null, 2),
                        active: blog.active,
                    });
                } catch (error) {
                    console.error("Failed to fetch blog", error);
                    message.error("Failed to load blog details");
                    navigate("/blogs");
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchBlog();
        }
    }, [id, isEdit, form, navigate]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Parse JSON data
            let blogJSONData = {};
            try {
                blogJSONData = JSON.parse(values.blogJSONData);
            } catch (e) {
                console.error("🚨 Invalid JSON format in Blog Content", e);
                message.error("Invalid JSON format in Blog Content");
                setLoading(false);
                return;
            }

            const payload = { ...values, blogJSONData };

            if (isEdit) {
                await blogApi.updateBlog(id as string, payload);
                message.success("Blog updated successfully");
            } else {
                await blogApi.createBlog(payload);
                message.success("Blog created successfully");
            }
            navigate("/blogs");
        } catch (error: any) {
            console.error("Failed to save blog", error);
            message.error(error.response?.data?.message || "Failed to save blog");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Spin size="large" tip="Loading blog details..." />
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <div className="flex items-center mb-8">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/blogs")}
                    className="mr-4"
                />
                <Title level={3} className="m-0">
                    {isEdit ? "Edit Blog" : "Create Blog"}
                </Title>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ active: true }}
                size="large"
            >
                <Form.Item
                    name="title"
                    label="Blog Title"
                    rules={[{ required: true, message: "Please enter blog title" }]}
                >
                    <Input placeholder="Enter a descriptive title" />
                </Form.Item>

                <Form.Item
                    name="slug"
                    label="Slug (URL Path)"
                    help="Auto-generated from title if left empty"
                >
                    <Input placeholder="e.g., how-to-build-a-dashboard" />
                </Form.Item>

                <Form.Item
                    name="bannerImgUrl"
                    label="Banner Image URL"
                >
                    <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>

                <Form.Item
                    name="blogJSONData"
                    label="Blog Content (JSON)"
                    rules={[{ required: true, message: "Please enter blog JSON data" }]}
                >
                    <TextArea
                        rows={10}
                        placeholder='{"sections": [{"type": "text", "content": "..."}]}'
                        className="font-mono"
                    />
                </Form.Item>

                <Form.Item
                    name="active"
                    label="Publish Status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item className="mt-8">
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loading}
                        size="large"
                        className="w-full sm:w-auto px-12"
                    >
                        {isEdit ? "Update Blog" : "Publish Blog"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default BlogForm;
