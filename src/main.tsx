import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#2563eb", // Blue-600
                    borderRadius: 6,
                },
            }}
        >
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ConfigProvider>
    </StrictMode>
);
