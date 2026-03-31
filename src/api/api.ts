import axiosInstance from "./axios";

// --- Auth APIs ---
export const authApi = {
    login: (data: any) => axiosInstance.post("/auth/login", data),
    register: (data: any) => axiosInstance.post("/auth/register", data),
    logout: () => axiosInstance.post("/auth/logout"),
    getProfile: () => axiosInstance.get("/auth/profile"),
    changePassword: (data: any) => axiosInstance.patch("/auth/change-password", data),
};

// --- Product APIs ---
export const productApi = {
    getProducts: (params: { page?: number; limit?: number }) =>
        axiosInstance.get("/product/view", { params }),
    getProduct: (id: string) => axiosInstance.get(`/product/view/${id}`),
    createProduct: (data: any) => axiosInstance.post("/product/create", data),
    updateProduct: (id: string, data: any) => axiosInstance.patch(`/product/update/${id}`, data),
    deleteProduct: (id: string) => axiosInstance.delete(`/product/delete/${id}`),
};

// --- Blog APIs ---
export const blogApi = {
    getBlogs: (params: { page?: number; limit?: number }) =>
        axiosInstance.get("/blog/admin/list", { params }),
    getBlog: (id: string) => axiosInstance.get(`/blog/view/${id}`), // Changed to fetch by ID for the dashboard
    getBlogBySlug: (slug: string) => axiosInstance.get(`/blog/list/${slug}`), // Public viewing
    createBlog: (data: any) => axiosInstance.post("/blog/create", data),
    updateBlog: (id: string, data: any) => axiosInstance.patch(`/blog/update/${id}`, data),
    deleteBlog: (id: string) => axiosInstance.delete(`/blog/delete/${id}`),
};

// --- Testimonial APIs ---
export const testimonialApi = {
    getTestimonials: () => axiosInstance.get("/testimonial"),
    getTestimonial: (id: string) => axiosInstance.get(`/testimonial/${id}`),
    createTestimonial: (data: any) => axiosInstance.post("/testimonial/create", data,),
    updateTestimonial: (id: string, data: any) => axiosInstance.put(`/testimonial/${id}`, data,),
    deleteTestimonial: (id: string) => axiosInstance.delete(`/testimonial/${id}`),
};

// --- Dashboard APIs ---
export const dashboardApi = {
    getStats: () => axiosInstance.get("/dashboard/stats"),
};
