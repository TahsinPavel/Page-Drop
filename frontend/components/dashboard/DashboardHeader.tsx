"use client";

import { Upload } from "lucide-react";

interface DashboardHeaderProps {
    breadcrumb?: string;
    pageTitle?: string;
    showActions?: boolean;
    onPublish?: () => void;
}

export default function DashboardHeader({
    breadcrumb = "PageDrop",
    pageTitle = "Dashboard",
    showActions = true,
    onPublish,
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
