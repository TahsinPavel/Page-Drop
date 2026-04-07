"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Layers } from "lucide-react";
import { login as loginApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

const schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const loginStore = useAuthStore((s) => s.login);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const res = await loginApi(data.email, data.password);
            loginStore(res.access_token, res.user);
            // Set cookie for middleware
            document.cookie = `token=${res.access_token}; path=/; max-age=${7 * 24 * 3600}`;
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch {
            toast.error("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "#0a0a0f",
                color: "#f9f5fd",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                WebkitFontSmoothing: "antialiased",
            }}
        >
            {/* ── Blurred Orbs Background ── */}
            <div
                style={{
                    position: "absolute",
                    top: "25%",
                    left: "-80px",
                    width: "260px",
                    height: "260px",
                    background: "rgba(189,157,255,0.3)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    opacity: 0.4,
                    zIndex: 0,
                    animation: "orbFloat1 20s infinite alternate ease-in-out",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "25%",
                    right: "-80px",
                    width: "288px",
                    height: "288px",
                    background: "rgba(195,139,245,0.2)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    opacity: 0.4,
                    zIndex: 0,
                    animation: "orbFloat2 18s infinite alternate ease-in-out",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    width: "200px",
                    height: "200px",
                    background: "rgba(138,76,252,0.15)",
                    borderRadius: "50%",
                    filter: "blur(100px)",
                    opacity: 0.3,
                    zIndex: 0,
                    animation: "orbFloat1 25s infinite alternate ease-in-out",
                }}
            />

            {/* ── Main Content ── */}
            <main
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    margin: "0 20px",
                    zIndex: 10,
                    animation: "authFadeUp 0.7s ease-out forwards",
                }}
            >
                {/* Logo Header */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "40px",
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textDecoration: "none",
                            gap: "16px",
                        }}
                    >
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                background: "#bd9dff",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 20px rgba(189,157,255,0.3)",
                            }}
                        >
                            <Layers
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    color: "#2e006c",
                                }}
                            />
                        </div>
                        <h2
                            style={{
                                color: "white",
                                fontWeight: 800,
                                fontSize: "20px",
                                letterSpacing: "-0.03em",
                                margin: 0,
                            }}
                        >
                            Page<span style={{ color: "#bd9dff" }}>Drop</span>
                        </h2>
                    </Link>
                </div>

                {/* Sign In Card */}
                <div
                    style={{
                        background: "rgba(25, 25, 31, 0.7)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow:
                            "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <h1
                            style={{
                                fontSize: "26px",
                                fontWeight: 700,
                                color: "white",
                                marginBottom: "8px",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Welcome back.
                        </h1>
                        <p
                            style={{
                                color: "#acaab1",
                                fontSize: "14px",
                                margin: 0,
                            }}
                        >
                            Sign in to manage your pages
                        </p>
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "32px",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background: "rgba(72,71,77,0.3)",
                            }}
                        />
                        <span
                            style={{
                                padding: "0 16px",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "0.15em",
                                color: "#acaab1",
                                fontWeight: 700,
                            }}
                        >
                            Sign in with email
                        </span>
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background: "rgba(72,71,77,0.3)",
                            }}
                        />
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#acaab1",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    marginBottom: "8px",
                                    paddingLeft: "4px",
                                }}
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@domain.com"
                                {...register("email")}
                                style={{
                                    width: "100%",
                                    background: "rgba(255,255,255,0.05)",
                                    border: errors.email
                                        ? "1px solid #ff6e84"
                                        : "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    padding: "14px 16px",
                                    color: "white",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#bd9dff";
                                    e.target.style.boxShadow =
                                        "0 0 0 1px #bd9dff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.email
                                        ? "#ff6e84"
                                        : "rgba(255,255,255,0.1)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                            {errors.email && (
                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "#ff6e84",
                                        marginTop: "6px",
                                        paddingLeft: "4px",
                                    }}
                                >
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#acaab1",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    marginBottom: "8px",
                                    paddingLeft: "4px",
                                }}
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                style={{
                                    width: "100%",
                                    background: "rgba(255,255,255,0.05)",
                                    border: errors.password
                                        ? "1px solid #ff6e84"
                                        : "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    padding: "14px 16px",
                                    color: "white",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#bd9dff";
                                    e.target.style.boxShadow =
                                        "0 0 0 1px #bd9dff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.password
                                        ? "#ff6e84"
                                        : "rgba(255,255,255,0.1)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                            {errors.password && (
                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "#ff6e84",
                                        marginTop: "6px",
                                        paddingLeft: "4px",
                                    }}
                                >
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                background: loading
                                    ? "linear-gradient(to right, rgba(189,157,255,0.6), rgba(138,76,252,0.6))"
                                    : "linear-gradient(to right, #bd9dff, #8a4cfc)",
                                color: "#2e006c",
                                fontWeight: 700,
                                padding: "16px",
                                borderRadius: "12px",
                                border: "none",
                                fontSize: "15px",
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow:
                                    "0 10px 25px rgba(124,58,237,0.25)",
                                transition: "all 0.2s ease",
                                marginTop: "4px",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    (e.target as HTMLButtonElement).style.boxShadow =
                                        "0 12px 30px rgba(124,58,237,0.35)";
                                    (e.target as HTMLButtonElement).style.transform =
                                        "translateY(-1px)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.boxShadow =
                                    "0 10px 25px rgba(124,58,237,0.25)";
                                (e.target as HTMLButtonElement).style.transform =
                                    "translateY(0)";
                            }}
                            onMouseDown={(e) => {
                                if (!loading) {
                                    (e.target as HTMLButtonElement).style.transform =
                                        "scale(0.98)";
                                }
                            }}
                            onMouseUp={(e) => {
                                (e.target as HTMLButtonElement).style.transform =
                                    "translateY(-1px)";
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            animation: "spin 1s linear infinite",
                                        }}
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div style={{ marginTop: "32px", textAlign: "center" }}>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#acaab1",
                                margin: 0,
                            }}
                        >
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                style={{
                                    color: "#bd9dff",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLAnchorElement).style.textDecoration =
                                        "underline";
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLAnchorElement).style.textDecoration =
                                        "none";
                                }}
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* ── Keyframe Animations ── */}
            <style jsx global>{`
                @keyframes authFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes orbFloat1 {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        transform: translate(30px, -40px) scale(1.1);
                    }
                }
                @keyframes orbFloat2 {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        transform: translate(-20px, 30px) scale(1.05);
                    }
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                input::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
