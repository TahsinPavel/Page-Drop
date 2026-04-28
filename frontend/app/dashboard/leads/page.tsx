"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useMyPages } from "@/hooks/usePages";
import {
    MessageCircle,
    Phone,
    Mail,
    Clock,
    Search,
    Filter,
    Download,
} from "lucide-react";

// Simulated leads data (would connect to real backend when available)
const mockLeads = [
    {
        id: "1",
        name: "Ahmed Khan",
        phone: "+92 300 1234567",
        page: "Khan Electronics",
        source: "WhatsApp",
        time: "2 min ago",
        status: "new",
    },
    {
        id: "2",
        name: "Sara Ali",
        phone: "+92 321 9876543",
        page: "Sara's Boutique",
        source: "WhatsApp",
        time: "15 min ago",
        status: "contacted",
    },
    {
        id: "3",
        name: "Usman Malik",
        phone: "+92 333 5557777",
        page: "Malik Auto Parts",
        source: "Phone Call",
        time: "1 hour ago",
        status: "contacted",
    },
    {
        id: "4",
        name: "Fatima Noor",
        phone: "+92 312 4445566",
        page: "Noor Fashion House",
        source: "WhatsApp",
        time: "3 hours ago",
        status: "converted",
    },
    {
        id: "5",
        name: "Bilal Raza",
        phone: "+92 345 6667788",
        page: "Raza Mobiles",
        source: "WhatsApp",
        time: "5 hours ago",
        status: "new",
    },
];

const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
    new: { bg: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "rgba(99,102,241,0.2)" },
    contacted: { bg: "rgba(250,204,21,0.1)", color: "#fbbf24", border: "rgba(250,204,21,0.2)" },
    converted: { bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.2)" },
};

const sourceIcons: Record<string, React.ElementType> = {
    WhatsApp: MessageCircle,
    "Phone Call": Phone,
    Email: Mail,
};

export default function LeadsPage() {
    const { data: pages } = useMyPages();
    const totalClicks = pages?.reduce((s, p) => s + p.whatsapp_clicks, 0) ?? 0;

    return (
        <>
            <DashboardHeader
                breadcrumb="PageDrop"
                pageTitle="Orders & Leads"
                showActions={false}
            />

            <div className="db-animate-in" style={{ marginBottom: 28 }}>
                <h1
                    className="text-slate-900 dark:text-[#e5e2e1]"
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        fontFamily: "var(--font-syne), sans-serif",
                    }}
                >
                    WhatsApp Leads
                </h1>
                <p className="text-slate-600 dark:text-[#908fa0]" style={{ fontSize: 14, marginTop: 4 }}>
                    Track inquiries and leads from your landing pages.
                </p>
            </div>

            {/* Summary pills */}
            <div
                className="db-animate-in db-animate-delay-1"
                style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}
            >
                <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20"
                >
                    <MessageCircle size={14} />
                    {totalClicks} Total WhatsApp Clicks
                </span>
                <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20"
                >
                    <Clock size={14} />
                    {mockLeads.length} Recent Inquiries
                </span>
            </div>

            {/* Search & filters */}
            <div
                className="db-animate-in db-animate-delay-2"
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20,
                    flexWrap: "wrap",
                }}
            >
                <div className="flex flex-1 min-w-[200px] items-center gap-2 px-4 py-2 rounded-[10px] bg-white dark:bg-[#201f1f]/60 border border-slate-200 dark:border-[#464554]/15">
                    <Search size={16} className="text-slate-400 dark:text-[#908fa0]" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="bg-transparent border-none outline-none text-slate-900 dark:text-[#e5e2e1] text-[13px] w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
                <button className="db-btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Filter size={14} />
                    Filter
                </button>
                <button className="db-btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Download size={14} />
                    Export
                </button>
            </div>

            {/* Leads table */}
            <div className="db-section-card db-animate-in db-animate-delay-3" style={{ padding: 0, overflow: "hidden" }}>
                <table className="db-leads-table">
                    <thead>
                        <tr>
                            <th>Lead</th>
                            <th>Phone</th>
                            <th>Page</th>
                            <th>Source</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockLeads.map((lead) => {
                            const SourceIcon = sourceIcons[lead.source] || MessageCircle;
                            const style = statusStyles[lead.status] || statusStyles.new;
                            return (
                                <tr key={lead.id}>
                                    <td style={{ fontWeight: 500 }}>{lead.name}</td>
                                    <td style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>
                                        {lead.phone}
                                    </td>
                                    <td>{lead.page}</td>
                                    <td>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                            <SourceIcon size={13} style={{ color: "#25D366" }} />
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td className="text-slate-500 dark:text-[#908fa0]">{lead.time}</td>
                                    <td>
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                padding: "2px 10px",
                                                borderRadius: 9999,
                                                fontSize: 11,
                                                fontWeight: 600,
                                                letterSpacing: "0.03em",
                                                textTransform: "uppercase",
                                                background: style.bg,
                                                color: style.color,
                                                border: `1px solid ${style.border}`,
                                            }}
                                        >
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Note */}
            <div
                className="db-animate-in db-animate-delay-4 text-slate-600 dark:text-[#908fa0]"
                style={{
                    marginTop: 16,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "rgba(99,102,241,0.05)",
                    border: "1px solid rgba(99,102,241,0.12)",
                    fontSize: 12,
                }}
            >
                💡 Leads tracking is based on WhatsApp click data from your pages. Full CRM integration coming soon.
            </div>
        </>
    );
}
