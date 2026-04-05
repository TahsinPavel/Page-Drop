/* ── Types for PageDrop frontend ── */

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    is_active: boolean;
    plan?: "free" | "pro" | "business";
    created_at: string;
    updated_at: string;
}

export interface Product {
    name: string;
    price?: string;
    description?: string | null;
    image_url?: string | null;
}

export interface BusinessHoursDay {
    open: string;
    close: string;
    closed: boolean;
}

export interface BusinessHours {
    monday?: BusinessHoursDay;
    tuesday?: BusinessHoursDay;
    wednesday?: BusinessHoursDay;
    thursday?: BusinessHoursDay;
    friday?: BusinessHoursDay;
    saturday?: BusinessHoursDay;
    sunday?: BusinessHoursDay;
}

export interface BusinessPage {
    id: string;
    user_id: string;
    slug: string;
    business_name: string;
    category: string;
    whatsapp_number: string;
    location: string | null;
    logo_url: string | null;
    banner_image_url?: string | null;
    phone_number?: string | null;
    business_hours?: BusinessHours | null;
    is_online_only: boolean;
    products: Product[] | null;
    ai_headline: string | null;
    ai_subheadline: string | null;
    ai_about: string | null;
    ai_cta_text: string | null;
    ai_products: Product[] | null;
    seo_title: string | null;
    seo_description: string | null;
    theme: "default" | "dark" | "minimal" | "vibrant";
    is_active: boolean;
    is_ai_generated: boolean;
    page_views: number;
    whatsapp_clicks: number;
    created_at: string;
    updated_at: string;
}

export interface PublicPage {
    id: string;
    slug: string;
    business_name: string;
    category: string;
    whatsapp_number: string;
    location: string | null;
    logo_url: string | null;
    banner_image_url?: string | null;
    phone_number?: string | null;
    business_hours?: BusinessHours | null;
    is_online_only: boolean;
    products: Product[] | null;
    ai_headline: string | null;
    ai_subheadline: string | null;
    ai_about: string | null;
    ai_cta_text: string | null;
    ai_products: Product[] | null;
    seo_title: string | null;
    seo_description: string | null;
    theme: "default" | "dark" | "minimal" | "vibrant";
    page_views: number;
    whatsapp_clicks: number;
    created_at: string;
}

export interface AIContent {
    headline: string;
    subheadline: string;
    about: string;
    cta_text: string;
    products: Product[] | null;
    seo_title: string;
    seo_description: string;
}

export interface CreatePageInput {
    business_name: string;
    category: string;
    whatsapp_number: string;
    phone_number?: string | null;
    is_online_only?: boolean;
    location?: string | null;
    business_hours?: BusinessHours | null;
    products?: Product[];
    theme: string;
    banner_image_url?: string | null;
}

export interface UpdatePageInput {
    business_name?: string;
    category?: string;
    whatsapp_number?: string;
    phone_number?: string | null;
    is_online_only?: boolean;
    location?: string | null;
    business_hours?: BusinessHours | null;
    products?: Product[];
    theme?: string;
    logo_url?: string;
    banner_image_url?: string | null;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    full_name?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface APIError {
    detail: string;
    status_code?: number;
}

/* ── Analytics Types ── */

export interface DayAnalytics {
    date: string;
    views: number;
    clicks: number;
}

export interface ReferrerAnalytics {
    referrer: string;
    count: number;
}

export interface BestDay {
    date: string;
    views: number;
}

export interface PageAnalyticsData {
    total_views: number;
    total_whatsapp_clicks: number;
    total_product_clicks: number;
    click_through_rate: number;
    views_by_day: DayAnalytics[];
    top_referrers: ReferrerAnalytics[];
    views_last_7_days: number;
    views_last_30_days: number;
    best_day: BestDay | null;
    funnel?: {
        visitors: number;
        interactions: number;
        focus_15s: number;
        cta_clicks: number;
    };
    conversion_baseline?: number;
    conversion_vs_baseline?: number;
}

export interface BestPerformingPage {
    slug: string;
    business_name: string;
    views: number;
}

export interface DashboardSummary {
    total_pages: number;
    total_views_all_time: number;
    total_whatsapp_clicks_all_time: number;
    total_views_last_30_days: number;
    best_performing_page: BestPerformingPage | null;
    views_change_pct?: number;
    clicks_change_pct?: number;
    conversion_rate?: number;
    conversion_change_pct?: number;
    acquisition_sources?: Array<{
        source: string;
        category: string;
        visits: number;
        percentage: number;
    }>;
    device_split?: {
        mobile_pct: number;
        desktop_pct: number;
    };
}

export interface CatalogPage {
    page_id: string;
    business_name: string;
    slug: string;
    category: string;
    views_30d: number;
    clicks_30d: number;
    conversion_rate: number;
    avg_time: number | null;
}

export interface RecentEvent {
    event_type: string;
    page_name: string;
    page_slug: string;
    referrer: string;
    device: string;
    time_ago: string;
    timestamp: string;
}

/* ── Payment Types ── */

export interface SubscriptionStatus {
    plan: 'free' | 'pro' | 'business';
    status: 'active' | 'cancelled' | 'expired';
    payment_provider: 'gumroad' | 'nowpayments' | 'manual' | null;
    current_period_end: string | null;
    cancelled_at: string | null;
    is_pro: boolean;
}

export interface NOWPaymentsInvoice {
    payment_id: string;
    payment_url: string;
    pay_address: string;
    pay_amount: number;
    price_amount: number;
    pay_currency: string;
    order_id: string;
    expiration_estimate_date: string;
}

export interface NOWPaymentsStatus {
    payment_id: string;
    payment_status: string;
    price_amount: number;
    pay_amount: number;
    actually_paid: number;
    pay_currency: string;
}
