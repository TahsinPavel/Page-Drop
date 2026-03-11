"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";

/**
 * Hook that hydrates auth state on mount and provides auth helpers.
 * Optionally redirects unauthenticated users to /login.
 */
export function useAuth(requireAuth = false) {
    const router = useRouter();
    const { user, token, isAuthenticated, login, logout, hydrate, setUser } =
        useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (requireAuth && !isAuthenticated && typeof window !== "undefined") {
            const stored = localStorage.getItem("token");
            if (!stored) {
                router.replace("/login");
            }
        }
    }, [requireAuth, isAuthenticated, router]);

    return { user, token, isAuthenticated, login, logout, setUser };
}
