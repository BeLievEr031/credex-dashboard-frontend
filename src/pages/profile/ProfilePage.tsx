import React, { useState } from "react";
import { Form, Input, Button, Card, Divider, message, Typography, Avatar, Space } from "antd";
import { UserOutlined, LockOutlined, SaveOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/api";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await authApi.changePassword(values);
            message.success("Password changed successfully!");
            form.resetFields();
        } catch (error: any) {
            console.error("Change password failed", error);
            message.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card className="shadow-sm">
                <div className="flex items-center space-x-6">
                    <Avatar size={100} icon={<UserOutlined />} className="bg-blue-600 shadow-md" />
                    <div>
                        <Title level={4} className="m-0 text-gray-500 uppercase tracking-widest text-xs">User Profile</Title>
                        <Title level={2} className="m-0 font-bold">{user?.name}</Title>
                        <Text className="text-gray-500">{user?.email}</Text>
                    </div>
                </div>
            </Card>

            <Divider />

            <Card className="shadow-sm" title={<Space><LockOutlined /> Change Password</Space>}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item
                        name="oldPassword"
                        label="Old Password"
                        rules={[{ required: true, message: "Please enter your current password" }]}
                    >
                        <Input.Password placeholder="Enter current password" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: "Please enter your new password" },
                            { min: 6, message: "Password must be at least 6 characters long" }
                        ]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Please confirm your new password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>

                    <Form.Item className="mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            size="large"
                            className="px-8"
                        >
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ProfilePage;
