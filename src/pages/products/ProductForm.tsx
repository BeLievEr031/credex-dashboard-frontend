import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin, Typography, Select, Switch, Upload } from "antd";
import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../../api/api";
import type { UploadFile, RcFile } from "antd/es/upload/interface";

const { Title } = Typography;

const ProductForm: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const res = await productApi.getProduct(id as string);
                    const product = res.data.data;
                    form.setFieldsValue({
                        product: product.product,
                        validity: product.validity,
                        credits: product.credits,
                        rateLimit: product.rateLimit,
                        active: product.active,
                    });
                    setPreviewImage(product.productImgUrl);
                } catch (error) {
                    console.error("Failed to fetch product", error);
                    message.error("Failed to load product details");
                    navigate("/products");
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEdit, form, navigate]);

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // 👈 converts to base64
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const formData = { ...values };
            // Ensure credits is correctly mapped

            if (fileList.length > 0) {
                const file = fileList[0].originFileObj as RcFile;
                const base64Str = await getBase64(file);
                formData['productImgUrl'] = base64Str;
                formData['image'] = base64Str;
            }

            if (isEdit) {
                await productApi.updateProduct(id as string, formData);
                message.success("Product updated successfully");
            } else {
                await productApi.createProduct(formData);
                message.success("Product created successfully");
            }
            navigate("/products");
        } catch (error: any) {
            console.error("Failed to save product", error);
            message.error(error.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const onFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    if (initialLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Spin size="large" tip="Loading product details..." />
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <div className="flex items-center mb-8">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/products")}
                    className="mr-4"
                />
                <Title level={3} className="m-0">
                    {isEdit ? "Edit Product" : "Create Product"}
                </Title>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ active: true, credits: [] }}
                size="large"
            >
                <Form.Item
                    name="product"
                    label="Product Name"
                    rules={[{ required: true, message: "Please enter product name" }]}
                >
                    <Input placeholder="e.g., Premium Subscription" />
                </Form.Item>

                <Form.Item
                    name="validity"
                    label="Validity Period"
                    rules={[{ required: true, message: "Please enter validity" }]}
                >
                    <Input placeholder="e.g., Monthly, 1 Year" />
                </Form.Item>

                <Form.Item
                    name="credits"
                    label="Credits / Features"
                    rules={[{ required: true, message: "Please add at least one credit" }]}
                >
                    <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        placeholder="Type and press Enter to add credits"
                        tokenSeparators={[","]}
                    />
                </Form.Item>

                <Form.Item
                    name="rateLimit"
                    label="Rate Limit (Optional)"
                >
                    <Input placeholder="e.g., 100 requests / min" />
                </Form.Item>

                <Form.Item
                    label="Product Image"
                    rules={[
                        {
                            required: !isEdit && fileList.length === 0,
                            message: "Please upload an image",
                        },
                    ]}
                    valuePropName="fileList"
                    getValueFromEvent={(e: any) => e?.fileList}
                >
                    <Upload
                        maxCount={1}
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={onFileChange}
                        accept="image/*"
                        listType="picture"
                    >
                        <Button icon={<UploadOutlined />}>
                            Click to Upload Image
                        </Button>
                    </Upload>
                </Form.Item>

                {previewImage && !fileList.length && (
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-48 h-48 object-cover rounded-lg"
                        />
                    </div>
                )}

                <Form.Item
                    name="active"
                    label="Active Status"
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
                        className="px-12"
                    >
                        {isEdit ? "Update Product" : "Save Product"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductForm;
