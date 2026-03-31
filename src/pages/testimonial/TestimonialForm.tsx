
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin, Typography, Upload } from "antd";
import { SaveOutlined, ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { testimonialApi } from "../../api/api";
import type { UploadFile, RcFile } from "antd/es/upload/interface";

const { Title } = Typography;
const { TextArea } = Input;

interface TestimonialFormData {
    feedback: string;
    image?: RcFile;
}

const TestimonialForm: React.FC = () => {
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
            const fetchTestimonial = async () => {
                try {
                    const response = await testimonialApi.getTestimonial(id as string);
                    const testimonial = response.data.data;
                    form.setFieldsValue({
                        feedback: testimonial.feedback,
                    });
                    setPreviewImage(testimonial.imageUrl);
                } catch (error) {
                    console.error("Failed to fetch testimonial", error);
                    message.error("Failed to load testimonial details");
                    navigate("/testimonials");
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchTestimonial();
        }
    }, [id, isEdit, form, navigate]);


    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // 👈 converts to base64
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const onFinish = async (values: TestimonialFormData) => {
        setLoading(true);
        try {
            const formData = {
                feedback: values.feedback,
                image: ""
            }
            console.log(formData)
            if (fileList.length > 0) {
                const file = fileList[0].originFileObj as RcFile;
                formData['image'] = await getBase64(file)
            }

            console.log(formData);
            if (isEdit) {
                await testimonialApi.updateTestimonial(id as string, formData);
                message.success("Testimonial updated successfully");
            } else {
                await testimonialApi.createTestimonial(formData);
                message.success("Testimonial created successfully");
            }
            navigate("/testimonials");
        } catch (error: any) {
            console.error("Failed to save testimonial", error);
            message.error(error.response?.data?.message || "Failed to save testimonial");
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
                <Spin size="large" tip="Loading testimonial details..." />
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <div className="flex items-center mb-8">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/testimonials")}
                    className="mr-4"
                />
                <Title level={3} className="m-0">
                    {isEdit ? "Edit Testimonial" : "Create Testimonial"}
                </Title>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-1"
            >
                <Form.Item
                    label="Feedback"
                    name="feedback"
                    rules={[
                        { required: true, message: "Please enter feedback" },
                        { min: 10, message: "Feedback must be at least 10 characters" },
                    ]}
                >
                    <TextArea
                        rows={6}
                        placeholder="Enter testimonial feedback"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    label="Image"
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

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        icon={<SaveOutlined />}
                        className="w-full"
                    >
                        {isEdit ? "Update Testimonial" : "Create Testimonial"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default TestimonialForm;