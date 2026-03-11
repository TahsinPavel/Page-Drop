"use client";

import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: (user: User) => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
    },

    setUser: (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    hydrate: () => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        const raw = localStorage.getItem("user");
        if (token && raw) {
            try {
                const user = JSON.parse(raw) as User;
                set({ token, user, isAuthenticated: true });
            } catch {
                set({ token: null, user: null, isAuthenticated: false });
            }
        }
    },
}));
