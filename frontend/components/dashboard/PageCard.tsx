"use client";

import Link from "next/link";
import { Eye, Pencil, GripVertical, Trash2, Package } from "lucide-react";
import type { BusinessPage } from "@/types";

interface PageCardProps {
    page: BusinessPage;
    onDelete?: (id: string) => void;
}

export default function PageCard({ page, onDelete }: PageCardProps) {
    const publicUrl = `/${page.slug}`;

    return (
        <div className="db-product-row">
            {/* Thumbnail */}
            <div className="db-product-thumb">
                {page.logo_url ? (
                    <img src={page.logo_url} alt={page.business_name} />
                ) : (
                    <Package size={20} style={{ color: "#908fa0" }} />
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#e5e2e1",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {page.business_name}
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: "#908fa0",
                        marginTop: 2,
                    }}
                >
                    {page.category}
                </div>
            </div>

            {/* Status badge */}
            <span className={page.is_active ? "db-badge-active" : "db-badge-draft"}>
                {page.is_active ? "ACTIVE" : "DRAFT"}
            </span>

            {/* Views */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    color: "#908fa0",
                    minWidth: 60,
                }}
            >
                <Eye size={14} />
                {page.page_views >= 1000
                    ? `${(page.page_views / 1000).toFixed(1)}k`
                    : page.page_views}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Link href={`/dashboard/pages/${page.id}`}>
                    <button className="db-icon-btn" title="Edit page">
                        <Pencil size={15} />
                    </button>
                </Link>
                <button className="db-icon-btn" title="Reorder">
                    <GripVertical size={15} />
                </button>
                {onDelete && (
                    <button
                        className="db-icon-btn danger"
                        title="Delete page"
                        onClick={() => onDelete(page.id)}
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}
