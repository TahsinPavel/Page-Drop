"use client";

import axios from "axios";
import type {
    AuthResponse,
    BusinessPage,
    CreatePageInput,
    DashboardSummary,
    NOWPaymentsInvoice,
    NOWPaymentsStatus,
    PageAnalyticsData,
    PublicPage,
    SubscriptionStatus,
    UpdatePageInput,
    User,
    AIContent,
} from "@/types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

/* ── Request interceptor: attach JWT ── */
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

/* ── Response interceptor: handle 401 ── */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

/* ── Auth ── */
export async function login(email: string, password: string): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const { data } = await api.post<AuthResponse>("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
}

export async function register(
    email: string,
    password: string,
    full_name?: string
): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", {
        email,
        password,
        full_name,
    });
    return data;
}

export async function getMe(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
}

export async function updateMe(full_name: string): Promise<User> {
    const { data } = await api.put<User>("/auth/me", { full_name });
    return data;
}

/* ── Pages ── */
export async function createPage(input: CreatePageInput): Promise<BusinessPage> {
    const { data } = await api.post<BusinessPage>("/pages/", input);
    return data;
}

export async function getMyPages(): Promise<BusinessPage[]> {
    const { data } = await api.get<BusinessPage[]>("/pages/my-pages");
    return data;
}

export async function getPageById(id: string): Promise<BusinessPage> {
    const { data } = await api.get<BusinessPage>(`/pages/my-pages/${id}`);
    return data;
}

export async function updatePage(
    id: string,
    input: UpdatePageInput
): Promise<BusinessPage> {
    const { data } = await api.put<BusinessPage>(`/pages/my-pages/${id}`, input);
    return data;
}

export async function deletePage(id: string): Promise<void> {
    await api.delete(`/pages/my-pages/${id}`);
}

export async function regenerateAI(id: string): Promise<BusinessPage> {
    const { data } = await api.post<BusinessPage>(
        `/pages/my-pages/${id}/regenerate-ai`
    );
    return data;
}

export async function getPublicPage(slug: string): Promise<PublicPage> {
    const { data } = await api.get<PublicPage>(`/pages/public/${slug}`);
    return data;
}

export async function trackWhatsAppClick(slug: string): Promise<void> {
    await api.post(`/pages/public/${slug}/whatsapp-click`);
}

/* ── AI ── */
export async function generateAIContent(input: {
    business_name: string;
    category: string;
    products?: { name: string; price: string; description?: string }[];
    location?: string;
}): Promise<AIContent> {
    const { data } = await api.post<AIContent>("/ai/generate", input);
    return data;
}

/* ── Upload ── */
export async function uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<{ logo_url: string }>(
        "/pages/upload/logo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.logo_url;
}

/* ── Analytics ── */
export async function getPageAnalytics(
    pageId: string,
    days: number = 30
): Promise<PageAnalyticsData> {
    const { data } = await api.get<PageAnalyticsData>(
        `/pages/my-pages/${pageId}/analytics`,
        { params: { days } }
    );
    return data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>(
        "/pages/analytics/summary"
    );
    return data;
}

/* ── Payments ── */
export async function createNOWPaymentsInvoice(
    plan: 'pro' | 'business'
): Promise<NOWPaymentsInvoice> {
    const { data } = await api.post<NOWPaymentsInvoice>(
        '/payments/nowpayments/create-invoice',
        { plan }
    );
    return data;
}

export async function checkNOWPaymentsStatus(
    paymentId: string
): Promise<NOWPaymentsStatus> {
    const { data } = await api.get<NOWPaymentsStatus>(
        `/payments/nowpayments/status/${paymentId}`
    );
    return data;
}

export async function getMySubscription(): Promise<SubscriptionStatus> {
    const { data } = await api.get<SubscriptionStatus>('/payments/subscription');
    return data;
}

export async function cancelSubscription(): Promise<{
    success: boolean;
    message: string;
    access_until: string | null;
}> {
    const { data } = await api.post<{
        success: boolean;
        message: string;
        access_until: string | null;
    }>('/payments/subscription/cancel');
    return data;
}

export default api;
