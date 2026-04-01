"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { AreaChartIcon } from "lucide-react";
import type { DayAnalytics } from "@/types";

interface TrafficChartProps {
    data: DayAnalytics[];
    days: number;
    onDaysChange: (days: number) => void;
    isPro: boolean;
}

const dayOptions = [
    { value: 7, label: "7D" },
    { value: 30, label: "30D" },
    { value: 90, label: "90D" },
] as const;

export default function TrafficChart({
    data,
    days,
    onDaysChange,
}: TrafficChartProps) {
    return (
        <div
            style={{
                background: "var(--pd-bg-secondary)",
                border: "1px solid var(--pd-border)",
                borderRadius: 16,
                overflow: "hidden",
            }}
        >
            <div style={{ padding: 24 }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <AreaChartIcon size={18} color="#6366F1" />
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: "var(--pd-text-primary)",
                                    fontSize: 16,
                                }}
                            >
                                Traffic Overview
                            </span>
                        </div>
                        <span
                            style={{
                                fontSize: 12,
                                color: "var(--pd-text-tertiary)",
                                display: "block",
                                marginTop: 2,
                            }}
                        >
                            Views and WhatsApp clicks over time
                        </span>
                    </div>

                    {/* Days selector */}
                    <div
                        style={{
                            display: "flex",
                            background: "var(--pd-bg-elevated)",
                            border: "1px solid var(--pd-border)",
                            borderRadius: 8,
                            padding: 4,
                            gap: 4,
                        }}
                    >
                        {dayOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => onDaysChange(opt.value)}
                                style={{
                                    padding: "6px 12px",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    borderRadius: 6,
                                    border: "none",
                                    cursor: "pointer",
                                    background:
                                        days === opt.value
                                            ? "#6366F1"
                                            : "transparent",
                                    color:
                                        days === opt.value
                                            ? "white"
                                            : "var(--pd-text-secondary)",
                                    transition: "all 150ms ease",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data}>
                            <defs>
                                <linearGradient
                                    id="viewsGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#6366F1"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#6366F1"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="clicksGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#10B981"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#10B981"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(val: string) => val.slice(5)}
                                tick={{ fill: "#5A5A7A", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fill: "#5A5A7A", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                width={35}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1A1A26",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 10,
                                    color: "#F0F0FF",
                                    fontSize: 13,
                                }}
                                labelStyle={{
                                    color: "#9090B0",
                                    marginBottom: 4,
                                }}
                                cursor={{
                                    stroke: "rgba(255,255,255,0.1)",
                                    strokeWidth: 1,
                                }}
                            />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{
                                    fontSize: 13,
                                    color: "#9090B0",
                                    paddingTop: 16,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="views"
                                name="Page Views"
                                stroke="#6366F1"
                                strokeWidth={2}
                                fill="url(#viewsGradient)"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    fill: "#6366F1",
                                    strokeWidth: 0,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="clicks"
                                name="WA Clicks"
                                stroke="#10B981"
                                strokeWidth={2}
                                fill="url(#clicksGradient)"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    fill: "#10B981",
                                    strokeWidth: 0,
                                }}
                            />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
