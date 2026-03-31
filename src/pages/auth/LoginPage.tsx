import React from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { authApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = React.useState(false);

    // Get the page where the user was before redirecting to login
    const from = (location.state as any)?.from?.pathname || "/";

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await authApi.login(values);
            if (response.data.user) {
                login(response.data.user);
                message.success("Login successful!");
                navigate(from, { replace: true });
            }
        } catch (error: any) {
            console.error("Login failed", error);
            message.error(error.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            // layout="vertical"
            size="large"
        >
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: "Please input your Email!" },
                    { type: "email", message: "Please enter a valid email!" },
                ]}
            >
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <div className="flex justify-between items-center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    {/* <a className="text-blue-600 hover:text-blue-700" href="">
                        Forgot password
                    </a> */}
                </div>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full h-12" loading={loading}>
                    Log in
                </Button>
                <div className="text-center mt-4">
                    Or <Link to="/register" className="text-blue-600 hover:text-blue-700">register now!</Link>
                </div>
            </Form.Item>
        </Form>
    );
};

export default LoginPage;
