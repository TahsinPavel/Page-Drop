"use client";

import Link from "next/link";
import { Plus, Eye, Upload } from "lucide-react";

interface DashboardHeaderProps {
    breadcrumb?: string;
    pageTitle?: string;
    showActions?: boolean;
    onPublish?: () => void;
    primarySlug?: string;
}

export default function DashboardHeader({
    breadcrumb = "PageDrop",
    pageTitle = "Dashboard",
    showActions = true,
    onPublish,
    primarySlug,
}: DashboardHeaderProps) {
    return (
        <div className="db-header db-animate-in">
            {/* Breadcrumb */}
            <div className="db-breadcrumb">
                <span>{breadcrumb}</span>
                <span style={{ color: "rgba(144,143,160,0.4)" }}>/</span>
                <span className="db-breadcrumb-active">{pageTitle}</span>
            </div>

            {/* Actions */}
            {showActions && (
                <div className="db-header-actions">
                    <Link href="/dashboard/create">
                        <button className="db-btn-icon" title="Create new page">
                            <Plus size={18} />
                        </button>
                    </Link>
                    {primarySlug && (
                        <a
                            href={`/${primarySlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="db-btn-outline">
                                <Eye size={14} style={{ marginRight: 6, display: "inline" }} />
                                Preview
                            </button>
                        </a>
                    )}
                    {onPublish && (
                        <button className="db-btn-solid" onClick={onPublish}>
                            <Upload size={14} style={{ marginRight: 6, display: "inline" }} />
                            Publish
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
