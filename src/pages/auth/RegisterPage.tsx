import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/api";

const RegisterPage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await authApi.register(values);
            message.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error: any) {
            console.error("Registration failed", error);
            message.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
        >
            <Form.Item
                name="name"
                rules={[{ required: true, message: "Please input your Full Name!" }]}
            >
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Full Name" />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: "Please input your Email!" },
                    { type: "email", message: "Please enter a valid email!" },
                ]}
            >
                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: "Please input your Password!" },
                    { min: 6, message: "Password must be at least 6 characters long!" },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("The two passwords that you entered do not match!"));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm Password"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full h-12" loading={loading}>
                    Register
                </Button>
                <div className="text-center mt-4 text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700">Login</Link>
                </div>
            </Form.Item>
        </Form>
    );
};

export default RegisterPage;
