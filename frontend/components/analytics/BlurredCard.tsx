"use client";

interface BlurredCardProps {
    children: React.ReactNode;
    isPro: boolean;
    featureName: string;
    minHeight?: string;
    onUpgradeClick?: () => void;
}

export default function BlurredCard({ children }: BlurredCardProps) {
    return <>{children}</>;
}
