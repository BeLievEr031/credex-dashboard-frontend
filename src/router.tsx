import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard Pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import BlogList from "./pages/blogs/BlogList";
import BlogForm from "./pages/blogs/BlogForm";
import ProductList from "./pages/products/ProductList";
import ProductForm from "./pages/products/ProductForm";
import TestimonialList from "./pages/testimonial/TestimonialList";
import TestimonialForm from "./pages/testimonial/TestimonialForm";
import NewsletterList from "./pages/newsletter/NewsletterList";
import ProfilePage from "./pages/profile/ProfilePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardHome />,
            },
            {
                path: "blogs",
                element: <BlogList />,
            },
            {
                path: "blogs/create",
                element: <BlogForm />,
            },
            {
                path: "blogs/edit/:id",
                element: <BlogForm />,
            },
            {
                path: "products",
                element: <ProductList />,
            },
            {
                path: "products/create",
                element: <ProductForm />,
            },
            {
                path: "products/edit/:id",
                element: <ProductForm />,
            },
            {
                path: "testimonials",
                element: <TestimonialList />,
            },
            {
                path: "testimonials/create",
                element: <TestimonialForm />,
            },
            {
                path: "testimonials/edit/:id",
                element: <TestimonialForm />,
            },
            {
                path: "newsletter",
                element: <NewsletterList />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            },
        ],
    },
    {
        element: (
            <PublicRoute>
                <AuthLayout />
            </PublicRoute>
        ),
        children: [
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default router;