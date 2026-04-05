"use client";

import {
    Activity,
    Eye,
    MessageCircle,
    Zap,
    Clock,
    ShoppingBag,
} from "lucide-react";
import type { RecentEvent } from "@/types";

interface RecentEventsFeedProps {
    events: RecentEvent[];
    loading: boolean;
}

type EventIconConfig = {
    icon: React.ElementType;
    bg: string;
    color: string;
};

const EVENT_ICONS: Record<string, EventIconConfig> = {
    page_view: { icon: Eye, bg: "rgba(99,102,241,0.15)", color: "#818CF8" },
    whatsapp_click: { icon: MessageCircle, bg: "rgba(16,185,129,0.15)", color: "#34D399" },
    interaction: { icon: Zap, bg: "rgba(139,92,246,0.15)", color: "#A78BFA" },
    focus_time_15s: { icon: Clock, bg: "rgba(245,158,11,0.15)", color: "#FBBF24" },
    product_click: { icon: ShoppingBag, bg: "rgba(59,130,246,0.15)", color: "#60A5FA" },
};

const DEFAULT_ICON: EventIconConfig = {
    icon: Activity,
    bg: "rgba(255,255,255,0.06)",
    color: "var(--pd-text-tertiary)",
};

function formatEventType(eventType: string): string {
    const formatted = eventType.replace(/_/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function RecentEventsFeed({ events, loading }: RecentEventsFeedProps) {
    return (
        <div
            style={{
                background: "var(--pd-bg-secondary)",
                border: "1px solid var(--pd-border)",
                borderRadius: 16,
                padding: 24,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={18} color="var(--pd-text-secondary)" />
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--pd-text-primary)",
                        }}
                    >
                        Live Activity Feed
                    </span>
                </div>
                <span
                    style={{
                        fontSize: 11,
                        background: "rgba(99,102,241,0.1)",
                        color: "#818CF8",
                        borderRadius: 9999,
                        padding: "3px 10px",
                        fontWeight: 500,
                    }}
                >
                    Last 10 events
                </span>
            </div>

            {/* Loading state */}
            {loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                height: 48,
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: 10,
                                animation: "pulse 2s infinite",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && events.length === 0 && (
                <p
                    style={{
                        textAlign: "center",
                        color: "var(--pd-text-tertiary)",
                        fontSize: 13,
                        padding: "24px 0",
                    }}
                >
                    No activity yet — share your page to see events here
                </p>
            )}

            {/* Event list */}
            {!loading && events.length > 0 && (
                <div>
                    {events.slice(0, 10).map((event, i) => {
                        const config = EVENT_ICONS[event.event_type] ?? DEFAULT_ICON;
                        const Icon = config.icon;

                        return (
                            <div
                                key={`${event.timestamp}-${i}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 0",
                                    borderBottom:
                                        i < events.length - 1
                                            ? "1px solid var(--pd-border)"
                                            : "none",
                                }}
                            >
                                {/* Icon */}
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        background: config.bg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon size={15} color={config.color} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "var(--pd-text-primary)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {formatEventType(event.event_type)}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 11,
                                            color: "var(--pd-text-tertiary)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {event.page_name}
                                        {event.referrer ? ` · ${event.referrer}` : ""}
                                        {event.device ? ` · ${event.device}` : ""}
                                    </p>
                                </div>

                                {/* Time */}
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: "var(--pd-text-tertiary)",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}
                                >
                                    {event.time_ago}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
