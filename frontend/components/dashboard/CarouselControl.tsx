"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import type { BusinessPage } from "@/types";

interface CarouselControlProps {
    pages: BusinessPage[];
}

export default function CarouselControl({ pages }: CarouselControlProps) {
    const [autoRotate, setAutoRotate] = useState(true);
    const activePages = pages.filter((p) => p.is_active);

    if (activePages.length === 0) return null;

    return (
        <div className="db-section-card db-animate-in db-animate-delay-5">
            <div className="db-section-title">Carousel Control</div>

            {/* Auto-rotation toggle */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                <span className="text-slate-900 dark:text-[#c8c6c5]" style={{ fontSize: 13, fontWeight: 500 }}>
                    Auto-Rotation
                </span>
                <button
                    type="button"
                    className={`db-toggle ${autoRotate ? "active" : ""}`}
                    onClick={() => setAutoRotate(!autoRotate)}
                    aria-label="Toggle auto-rotation"
                />
            </div>

            {/* Sequence */}
            <div className="text-slate-600 dark:text-[#908fa0]" style={{ fontSize: 12, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Sequence Order
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {activePages.slice(0, 5).map((page, idx) => (
                    <div key={page.id} className="db-sequence-item">
                        <div className="db-sequence-number">
                            {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                className="text-slate-900 dark:text-[#e5e2e1]"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {page.business_name}
                            </div>
                        </div>
                        <GripVertical size={16} className="text-slate-400 dark:text-[#5a5a7a]" style={{ cursor: "grab" }} />
                    </div>
                ))}
            </div>

            <button className="db-btn-primary" style={{ width: "100%" }}>
                Save Sequence
            </button>
        </div>
    );
}
