"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
    icon: LucideIcon;
    label: string;
    href?: string;
    onClick?: () => void;
    delay?: number;
}

export default function QuickActionCard({
    icon: Icon,
    label,
    href,
    onClick,
    delay = 0,
}: QuickActionCardProps) {
    const content = (
        <>
            <div className="db-action-icon">
                <Icon size={22} />
            </div>
            <span
                style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#c8c6c5",
                }}
            >
                {label}
            </span>
        </>
    );

    const className = `db-action-card db-animate-in db-animate-delay-${delay}`;

    if (href) {
        return (
            <Link href={href} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button className={className} onClick={onClick} type="button">
            {content}
        </button>
    );
}
