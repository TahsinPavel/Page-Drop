"use client";

import { useAuthStore } from "@/lib/auth";

export function usePlan() {
    const user = useAuthStore((state) => state.user);
    const plan = user?.plan ?? "free";
    const isPro = plan === "pro" || plan === "business";
    const isBusiness = plan === "business";
    const isFree = plan === "free";

    return { plan, isPro, isBusiness, isFree };
}
