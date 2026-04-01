"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useMyPages } from "@/hooks/usePages";
import {
    Eye,
    MousePointerClick,
    TrendingUp,
    TrendingDown,
    Star,
    Target,
    Sparkles,
    AlertTriangle,
    Lightbulb,
    ChevronRight,
    Search,
    MoreVertical,
    Share2,
    Globe,
    Link2,
    Smartphone,
    Monitor,
} from "lucide-react";
import "./analytics.css";

/* ── Mock data to match the Stitch design ── */
// In production, these would come from your analytics API.
const MOCK_LIVE_EVENTS = [
    {
        id: 1,
        text: (
            <>
                New interaction in <span className="highlight">London, UK</span>
            </>
        ),
        sub: "3D Rotation: Carbon Table • 2s ago",
    },
    {
        id: 2,
        text: (
            <>
                WhatsApp Conversion from <span className="highlight">Dubai, UAE</span>
            </>
        ),
        sub: "Product: Onyx Sphere • 14s ago",
    },
    {
        id: 3,
        text: (
            <>
                Page View in <span className="highlight">New York, US</span>
            </>
        ),
        sub: "Direct Link • 1m ago",
    },
    {
        id: 4,
        text: "Interaction End",
        sub: "Interaction Time: 2m 45s • 3m ago",
        faded: true,
    },
];

const MOCK_PRODUCTS = [
    {
        name: "Obsidian Chrono V1",
        views: 4291,
        avgTime: "48s",
        interactions: 2103,
        convRate: 5.8,
        high: true,
        thumb: null,
    },
    {
        name: "Onyx Sphere Lamp",
        views: 2842,
        avgTime: "32s",
        interactions: 1029,
        convRate: 2.4,
        high: false,
        thumb: null,
    },
    {
        name: "Zenith Chair",
        views: 5102,
        avgTime: "54s",
        interactions: 3492,
        convRate: 8.2,
        high: true,
        thumb: null,
    },
];

const MOCK_SOURCES = [
    { name: "Instagram Ads", icon: "instagram", pct: 45, count: 5779 },
    { name: "TikTok Organic", icon: "tiktok", pct: 32, count: 4109 },
    { name: "Direct / Others", icon: "direct", pct: 23, count: 2954 },
];

export default function AnalyticsPage() {
    const { data: pages } = useMyPages();
    const [activeTab, setActiveTab] = useState<"global" | "comparison">("global");
    const [productSearch, setProductSearch] = useState("");

    /* ── Compute live values from pages data ── */
    const totalViews = pages?.reduce((s, p) => s + p.page_views, 0) ?? 0;
    const totalClicks = pages?.reduce((s, p) => s + p.whatsapp_clicks, 0) ?? 0;
    const conversionRate =
        totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";
    const topProduct =
        pages && pages.length > 0
            ? pages.reduce((best, p) => (p.page_views > best.page_views ? p : best))
            : null;

    /* Use real data when available, else showcase demo values */
    const displayViews = totalViews > 0 ? totalViews.toLocaleString() : "12,842";
    const displayClicks = totalClicks > 0 ? totalClicks.toLocaleString() : "1,054";
    const displayConv = totalViews > 0 ? `${conversionRate}%` : "4.12%";
    const displayTop = topProduct ? topProduct.business_name : "Titanium V1";

    /* Filter mock products for catalogue search */
    const filteredProducts = MOCK_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()),
    );

    /* Use real pages in catalog if available */
    const catalogPages =
        pages && pages.length > 0
            ? pages.map((p) => ({
                  name: p.business_name,
                  views: p.page_views,
                  avgTime: "—",
                  interactions: p.whatsapp_clicks,
                  convRate:
                      p.page_views > 0
                          ? parseFloat(
                                ((p.whatsapp_clicks / p.page_views) * 100).toFixed(1),
                            )
                          : 0,
                  high: p.page_views > 0 && (p.whatsapp_clicks / p.page_views) * 100 > 3,
                  thumb: p.logo_url,
              }))
            : filteredProducts;

    return (
        <>
            {/* Dashboard header (breadcrumb) */}
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle="Analytics"
                showActions={false}
            />

            {/* Sub-header bar */}
            <div
                className="db-animate-in"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 32,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                    <h1
                        style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: "#c6c6c8",
                            fontFamily: "var(--font-syne), sans-serif",
                        }}
                    >
                        Analytics Dashboard
                    </h1>
                    <div className="an-tabs">
                        <button
                            className={`an-tab ${activeTab === "global" ? "active" : ""}`}
                            onClick={() => setActiveTab("global")}
                        >
                            Global View
                        </button>
                        <button
                            className={`an-tab ${activeTab === "comparison" ? "active" : ""}`}
                            onClick={() => setActiveTab("comparison")}
                        >
                            Comparison
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button className="db-btn-outline" style={{ fontSize: 12 }}>
                        Date Range
                    </button>
                    <button
                        className="db-btn-primary"
                        style={{
                            borderRadius: 999,
                            fontSize: 12,
                            boxShadow: "0 0 0 0 rgba(198, 198, 200, 0.15)",
                            animation: "an-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                        }}
                    >
                        Export Report
                    </button>
                </div>
            </div>

            {/* ═══════════════════════ 1. KPI Cards ═══════════════════════ */}
            <div className="an-kpi-grid db-animate-in db-animate-delay-1">
                {/* Total Visitors */}
                <div className="an-kpi-card">
                    <span className="an-kpi-ghost">
                        <Eye size={36} />
                    </span>
                    <p className="an-kpi-label">Total Visitors</p>
                    <p className="an-kpi-value">{displayViews}</p>
                    <p className="an-kpi-trend positive">
                        <TrendingUp size={12} />
                        +14.2% from last month
                    </p>
                </div>

                {/* WhatsApp Clicks */}
                <div className="an-kpi-card">
                    <span className="an-kpi-ghost">
                        <MousePointerClick size={36} />
                    </span>
                    <p className="an-kpi-label">WhatsApp Clicks</p>
                    <p className="an-kpi-value">{displayClicks}</p>
                    <p className="an-kpi-trend neutral">8.2% click-through rate</p>
                </div>

                {/* Conversion Rate */}
                <div className="an-kpi-card">
                    <span className="an-kpi-ghost">
                        <Target size={36} />
                    </span>
                    <p className="an-kpi-label">Conversion Rate</p>
                    <p className="an-kpi-value">{displayConv}</p>
                    <p className="an-kpi-trend negative">
                        <TrendingDown size={12} />
                        -0.5% vs baseline
                    </p>
                </div>

                {/* Top Product */}
                <div className="an-kpi-card">
                    <span className="an-kpi-ghost">
                        <Star size={36} />
                    </span>
                    <p className="an-kpi-label">Top Product</p>
                    <p className="an-kpi-value" style={{ fontSize: topProduct ? 22 : 30 }}>
                        {displayTop}
                    </p>
                    <p className="an-kpi-trend neutral">
                        {topProduct
                            ? `${topProduct.page_views.toLocaleString()} views`
                            : "640 unique interactions"}
                    </p>
                </div>
            </div>

            {/* ═══════════════ 2. Insights + Live Activity ═══════════════ */}
            <div
                className="db-animate-in db-animate-delay-2"
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 28,
                    marginBottom: 32,
                }}
            >
                {/* Insights Panel */}
                <div className="an-insights">
                    <div className="an-insights-header">
                        <Sparkles size={20} style={{ color: "#378afd" }} />
                        <h2>Obsidian Intelligence Insights</h2>
                    </div>

                    <div className="an-insight-item">
                        <div className="an-insight-icon">
                            <AlertTriangle size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p className="an-insight-title">
                                {topProduct
                                    ? `"${topProduct.business_name}" has high views but low conversion`
                                    : `Product "Obsidian Chrono" has high views but low conversion (1.2%)`}
                            </p>
                            <p className="an-insight-desc">
                                Users are spending an average of 42s on the 3D viewer but
                                dropping off at the &apos;Add to Cart&apos; stage. Interaction
                                depth is high, suggesting price sensitivity or lack of clear CTA
                                positioning.
                            </p>
                            <div className="an-insight-actions">
                                <button className="an-btn-pill an-btn-fill">Run A/B Test</button>
                                <button className="an-btn-pill an-btn-ghost">
                                    View Heatmap
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="an-insight-item">
                        <div className="an-insight-icon">
                            <Lightbulb size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p className="an-insight-title">
                                Interaction Depth Increase on Mobile Devices
                            </p>
                            <p className="an-insight-desc" style={{ marginBottom: 0 }}>
                                TikTok referrals show 2.4x more interaction depth than
                                Instagram. Consider boosting TikTok ad spend for the
                                &quot;Zenith Chair&quot; collection.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Live Activity */}
                <div className="an-live">
                    <div className="an-live-header">
                        <h2>Live Activity</h2>
                        <div className="an-live-badge">
                            <div className="an-live-dot" />
                            <span className="an-live-count">42 Active Users</span>
                        </div>
                    </div>

                    <div className="an-live-items">
                        {MOCK_LIVE_EVENTS.map((ev) => (
                            <div
                                key={ev.id}
                                className={`an-live-item ${ev.faded ? "faded" : ""}`}
                            >
                                <div className="an-live-bullet" />
                                <div>
                                    <p className="an-live-text">{ev.text}</p>
                                    <p className="an-live-sub">{ev.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Traffic Map */}
                    <div className="an-live-map">
                        <p className="an-live-map-label">Traffic Map</p>
                        <div className="an-live-map-img">
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background:
                                        "radial-gradient(ellipse at 30% 50%, rgba(55,138,253,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(55,138,253,0.08) 0%, transparent 40%), #1f2020",
                                }}
                            />
                            <div className="an-live-map-overlay" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ 3. Experience Funnel ═══════════════ */}
            <div
                className="an-funnel db-animate-in db-animate-delay-3"
                style={{ marginBottom: 32 }}
            >
                <div className="an-funnel-header">
                    <h2>Experience Funnel</h2>
                    <span>Last 30 Days Cumulative</span>
                </div>
                <div className="an-funnel-steps">
                    {[
                        { label: "Visitors", value: displayViews, pct: null },
                        { label: "Interactions", value: "8,421", pct: "65% step-through" },
                        {
                            label: "Focus Time (+15s)",
                            value: "3,102",
                            pct: "37% step-through",
                        },
                        { label: "CTA Clicks", value: "529", pct: "17% conversion" },
                    ].map((step, i) => (
                        <div className="an-funnel-step" key={step.label}>
                            <div className="an-funnel-step-inner">
                                <p className="an-funnel-step-label">{step.label}</p>
                                <p className="an-funnel-step-value">{step.value}</p>
                                {step.pct && (
                                    <p className="an-funnel-step-pct">{step.pct}</p>
                                )}
                            </div>
                            {i < 3 && (
                                <div className="an-funnel-chevron">
                                    <ChevronRight size={14} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════ 4. Heatmap + CTA Comparison ═══════════ */}
            <div
                className="an-split-row db-animate-in db-animate-delay-4"
                style={{ marginBottom: 32 }}
            >
                {/* Interaction Heatmap */}
                <div className="an-heatmap">
                    <div className="an-heatmap-header">
                        <div>
                            <h2>Interaction Heatmap</h2>
                            <p>Top-view of 3D attention zones</p>
                        </div>
                        <select className="an-heatmap-select">
                            <option>Obsidian Chrono V1</option>
                            <option>Zenith Table</option>
                        </select>
                    </div>
                    <div className="an-heatmap-canvas">
                        {/* 3D product placeholder with heat zones */}
                        <div className="an-heatmap-product">
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    background:
                                        "radial-gradient(circle, rgba(55,138,253,0.06) 0%, transparent 70%)",
                                    opacity: 0.5,
                                }}
                            />
                            {/* Heat zones */}
                            <div
                                className="an-heat-zone high"
                                style={{
                                    top: "25%",
                                    left: "25%",
                                    width: 128,
                                    height: 128,
                                }}
                            />
                            <div
                                className="an-heat-zone mid"
                                style={{
                                    top: "50%",
                                    right: "25%",
                                    width: 80,
                                    height: 80,
                                }}
                            />
                            <div
                                className="an-heat-zone low"
                                style={{
                                    bottom: "33%",
                                    left: "50%",
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            {/* Tooltip */}
                            <div
                                className="an-heatmap-tooltip"
                                style={{ top: "25%", left: "33%" }}
                            >
                                <span className="label">Crown Focus:</span>
                                <span className="val">High (42%)</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="an-heatmap-legend">
                            <div className="an-legend-item">
                                <div className="an-legend-swatch high" />
                                <span className="an-legend-label">
                                    High Attention (&gt;12s)
                                </span>
                            </div>
                            <div className="an-legend-item">
                                <div className="an-legend-swatch mid" />
                                <span className="an-legend-label">
                                    Mid Attention (5-12s)
                                </span>
                            </div>
                            <div className="an-legend-item">
                                <div className="an-legend-swatch low" />
                                <span className="an-legend-label">
                                    Low Attention (&lt;5s)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Comparison */}
                <div className="an-cta-compare">
                    <div>
                        <div className="an-cta-compare-header">
                            <h2>CTA Comparison</h2>
                            <span className="an-cta-badge">Running</span>
                        </div>

                        {/* Winner variation */}
                        <div className="an-cta-variant winner">
                            <div className="an-cta-winner-badge">
                                Variation A (Winner)
                            </div>
                            <div className="an-cta-row">
                                <p className="an-cta-name">
                                    &quot;Inquire on WhatsApp&quot;
                                </p>
                                <p className="an-cta-pct">6.8%</p>
                            </div>
                            <div className="an-cta-bar-track">
                                <div
                                    className="an-cta-bar-fill"
                                    style={{ width: "68%" }}
                                />
                            </div>
                            <p className="an-cta-note">
                                Highest engagement on evening traffic (6PM - 10PM)
                            </p>
                        </div>

                        {/* Loser variation */}
                        <div className="an-cta-variant loser">
                            <div className="an-cta-row">
                                <p className="an-cta-name">
                                    &quot;Check Availability&quot;
                                </p>
                                <p className="an-cta-pct">4.1%</p>
                            </div>
                            <div className="an-cta-bar-track">
                                <div
                                    className="an-cta-bar-fill"
                                    style={{ width: "41%" }}
                                />
                            </div>
                            <p className="an-cta-note">
                                Commonly clicked but higher drop-off after interaction.
                            </p>
                        </div>
                    </div>

                    <button className="an-cta-details-btn">
                        View Full Test Details
                    </button>
                </div>
            </div>

            {/* ═══════════════ 5. Catalog Deep-Dive ═══════════════ */}
            <div
                className="an-catalog db-animate-in db-animate-delay-5"
                style={{ marginBottom: 32 }}
            >
                <div className="an-catalog-header">
                    <h2>Catalog Deep-Dive</h2>
                    <div className="an-catalog-search">
                        <Search size={14} style={{ color: "#acabaa" }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table className="an-catalog-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Total Views</th>
                                <th>Avg. Time (s)</th>
                                <th>Interactions</th>
                                <th>Conv. Rate</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {catalogPages
                                .filter((p) =>
                                    p.name
                                        .toLowerCase()
                                        .includes(productSearch.toLowerCase()),
                                )
                                .map((product) => (
                                    <tr key={product.name}>
                                        <td>
                                            <div className="an-product-cell">
                                                <div className="an-product-thumb">
                                                    {product.thumb ? (
                                                        <img
                                                            src={product.thumb}
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                background:
                                                                    "linear-gradient(135deg, #1f2020, #252626)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: "#484848",
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            {product.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="an-product-name">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {product.views.toLocaleString()}
                                        </td>
                                        <td>{product.avgTime}</td>
                                        <td>
                                            {product.interactions.toLocaleString()}
                                        </td>
                                        <td>
                                            <span
                                                className={`an-conv-badge ${product.high ? "high" : "low"}`}
                                            >
                                                {product.convRate}%
                                            </span>
                                        </td>
                                        <td>
                                            <button className="an-more-btn">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ════════════ 6. Acquisition Sources + Device Split ════════════ */}
            <div
                className="an-sources-row db-animate-in db-animate-delay-6"
                style={{ marginBottom: 32 }}
            >
                {/* Sources */}
                <div className="an-sources">
                    <h2>Acquisition Sources</h2>
                    <div className="an-source-items">
                        {MOCK_SOURCES.map((src) => (
                            <div className="an-source-item" key={src.name}>
                                <div className="an-source-info">
                                    <span className={`icon ${src.icon}`}>
                                        {src.icon === "instagram" && (
                                            <Share2
                                                size={18}
                                                style={{ color: "#e1306c" }}
                                            />
                                        )}
                                        {src.icon === "tiktok" && (
                                            <Globe
                                                size={18}
                                                style={{ color: "#378afd" }}
                                            />
                                        )}
                                        {src.icon === "direct" && (
                                            <Link2
                                                size={18}
                                                style={{ color: "#9e9da2" }}
                                            />
                                        )}
                                    </span>
                                    <span className="an-source-name">{src.name}</span>
                                </div>
                                <div className="an-source-bar">
                                    <div className="an-source-bar-track">
                                        <div
                                            className="an-source-bar-fill"
                                            style={{ width: `${src.pct}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="an-source-stats">
                                    <p className="an-source-pct">{src.pct}%</p>
                                    <p className="an-source-count">
                                        {src.count.toLocaleString()} visitors
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Split */}
                <div className="an-devices">
                    <h2>Device Split</h2>
                    <div className="an-device-bars">
                        <div className="an-device-bar-group">
                            <div
                                className="an-device-bar mobile"
                                style={{ height: "78%" }}
                            />
                            <div className="an-device-label">
                                <Smartphone size={18} style={{ marginBottom: 4 }} />
                                <span className="an-device-pct">78%</span>
                                <span className="an-device-name">Mobile</span>
                            </div>
                        </div>
                        <div className="an-device-bar-group">
                            <div
                                className="an-device-bar desktop"
                                style={{ height: "22%" }}
                            />
                            <div className="an-device-label">
                                <Monitor size={18} style={{ marginBottom: 4 }} />
                                <span className="an-device-pct">22%</span>
                                <span className="an-device-name">Desktop</span>
                            </div>
                        </div>
                    </div>
                    <p className="an-devices-note">
                        Touch interactions are 4x more frequent than mouse-based
                        interactions.
                    </p>
                </div>
            </div>

            {/* ── Bottom spacer ── */}
            <div style={{ height: 48 }} />
        </>
    );
}
