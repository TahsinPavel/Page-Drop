"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Loader2,
    Layers,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Zap,
    Clock,
    Box,
    ShieldCheck,
    Star,
} from "lucide-react";
import { register as registerApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

const schema = z.object({
    full_name: z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

/* ── Password strength helper ── */
function getPasswordStrength(pw: string): { level: number; label: string } {
    if (!pw) return { level: 0, label: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: "Weak" };
    if (score <= 2) return { level: 2, label: "Medium" };
    if (score <= 3) return { level: 3, label: "Strong" };
    return { level: 4, label: "Very Strong" };
}

export default function SignupPage() {
    const router = useRouter();
    const loginStore = useAuthStore((s) => s.login);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const cardRef = useRef<HTMLDivElement>(null);

    const {
        register: reg,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const res = await registerApi(data.email, data.password, data.full_name);
            loginStore(res.access_token, res.user);
            document.cookie = `token=${res.access_token}; path=/; max-age=${7 * 24 * 3600}`;
            toast.success("Account created! Welcome to PageDrop 🎉");
            router.push("/dashboard");
        } catch {
            toast.error("Could not create account. Email may already be registered.");
        } finally {
            setLoading(false);
        }
    };

    /* ── 3D Card mouse-tracking (desktop only) ── */
    const animFrameRef = useRef<number>(0);
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const w = window.innerWidth;
        if (w < 1024) return;
        const centerX = w * 0.275;
        const centerY = window.innerHeight / 2;
        if (e.clientX > w * 0.55) {
            targetRef.current = { x: 0, y: 0 };
        } else {
            targetRef.current = {
                y: ((e.clientX - centerX) / centerX) * 12,
                x: ((e.clientY - centerY) / centerY) * -12,
            };
        }
    }, []);

    useEffect(() => {
        const animate = () => {
            const t = targetRef.current;
            const c = currentRef.current;
            c.x += (t.x - c.x) * 0.08;
            c.y += (t.y - c.y) * 0.08;
            if (cardRef.current) {
                cardRef.current.style.transform = `rotateX(${c.x}deg) rotateY(${c.y}deg)`;
            }
            animFrameRef.current = requestAnimationFrame(animate);
        };
        window.addEventListener("mousemove", handleMouseMove);
        animFrameRef.current = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [handleMouseMove]);

    const strength = getPasswordStrength(passwordValue);

    return (
        <div className="signup-root">
            {/* ══════════ LEFT PANEL — 3D Hero (Desktop Only) ══════════ */}
            <section className="signup-hero">
                {/* Ambient glow */}
                <div className="hero-glow" />

                {/* 3D Perspective Card */}
                <div className="perspective-wrap">
                    <div className="perspective-container">
                        <div ref={cardRef} className="monolith-card">
                            {/* Card BG image */}
                            <div className="monolith-bg">
                                <div className="monolith-bg-gradient" />
                            </div>

                            {/* Floating badges */}
                            <div className="badge badge-3d">
                                <Box size={14} className="badge-icon" />
                                <span>3D Ready</span>
                            </div>
                            <div className="badge badge-nocode">
                                <Zap size={14} className="badge-icon" />
                                <span>No Code</span>
                            </div>
                            <div className="badge badge-live">
                                <Clock size={14} className="badge-icon" />
                                <span>Live in 5 min</span>
                            </div>

                            {/* Card content */}
                            <div className="monolith-content">
                                <div className="monolith-icon-box">
                                    <Layers size={24} color="white" />
                                </div>
                                <h3 className="monolith-title">
                                    Spatial Layout<br />System 4.0
                                </h3>
                                <div className="monolith-bars">
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: "66%" }} />
                                    </div>
                                    <div className="bar-track" style={{ width: "50%" }}>
                                        <div className="bar-fill" style={{ width: "100%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social proof */}
                <div className="social-proof">
                    <div className="avatar-stack">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="avatar-circle">
                                <User size={16} color="#bd9dff" />
                            </div>
                        ))}
                        <div className="avatar-count">+1.2k</div>
                    </div>
                    <p className="social-text">Joined by 1,200+ businesses worldwide</p>
                    <div className="rating-row">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                            ))}
                        </div>
                        <span className="rating-number">4.9/5</span>
                        <span className="rating-label">rating</span>
                    </div>
                </div>
            </section>

            {/* ══════════ RIGHT PANEL — Form ══════════ */}
            <main className="signup-form-panel">
                <div className="form-inner">
                    {/* Brand */}
                    <Link href="/" className="brand-row">
                        <div className="brand-icon">
                            <Layers size={18} color="white" />
                        </div>
                        <span className="brand-text">
                            Page<span className="brand-accent">Drop</span>
                        </span>
                    </Link>

                    {/* Heading */}
                    <div className="form-header">
                        <h1 className="form-title">Create your account</h1>
                        <p className="form-subtitle">Start building pages that convert.</p>
                    </div>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line" />
                        <span className="divider-text">or</span>
                        <div className="divider-line" />
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="reg-form">
                        {/* Full Name */}
                        <div className="field-group">
                            <div className="input-wrap">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    id="full_name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="field-input"
                                    {...reg("full_name")}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="field-group">
                            <div className="input-wrap">
                                <div className="input-icon">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    className={`field-input ${errors.email ? "field-error" : ""}`}
                                    {...reg("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="error-msg">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="field-group">
                            <div className="input-wrap">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className={`field-input field-input-pw ${errors.password ? "field-error" : ""}`}
                                    {...reg("password", {
                                        onChange: (e) => setPasswordValue(e.target.value),
                                    })}
                                />
                                <button
                                    type="button"
                                    className="pw-toggle"
                                    onClick={() => setShowPassword((p) => !p)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Strength meter */}
                            {passwordValue.length > 0 && (
                                <div className="strength-section">
                                    <div className="strength-bars">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`strength-bar ${i <= strength.level ? "strength-bar-active" : ""}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="strength-labels">
                                        <span className="strength-text">
                                            {strength.label.toUpperCase()}
                                        </span>
                                        <span className="strength-hint">Min. 8 characters</span>
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p className="error-msg">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="cta-button"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="cta-spinner" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create my free account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="form-footer">
                        <p className="footer-link-text">
                            Already have an account?{" "}
                            <Link href="/login" className="footer-link">
                                Sign in
                            </Link>
                        </p>
                        <div className="privacy-note">
                            <ShieldCheck size={13} />
                            <span>We never share your data. Ever.</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Mobile Fixed Bottom CTA ── */}
            <div className="mobile-cta-bar">
                <button
                    type="button"
                    disabled={loading}
                    className="cta-button"
                    onClick={handleSubmit(onSubmit)}
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="cta-spinner" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create my free account
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>

            {/* ── Background orbs (mobile) ── */}
            <div className="bg-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>

            {/* ══════════ STYLES ══════════ */}
            <style jsx global>{`
                /* ── Reset & Base ── */
                .signup-root {
                    font-family: "Inter", sans-serif;
                    background-color: #0a0a0f;
                    color: #f9f5fd;
                    min-height: 100vh;
                    display: flex;
                    overflow: hidden;
                    -webkit-font-smoothing: antialiased;
                    position: relative;
                }

                /* ══════ LEFT PANEL ══════ */
                .signup-hero {
                    display: none;
                }

                /* ══════ RIGHT PANEL ══════ */
                .signup-form-panel {
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 24px 120px;
                    position: relative;
                    z-index: 10;
                    overflow-y: auto;
                    background: #0a0a0f;
                }

                .form-inner {
                    width: 100%;
                    max-width: 400px;
                    animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                /* Brand */
                .brand-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                    text-decoration: none;
                }
                .brand-icon {
                    width: 32px;
                    height: 32px;
                    background: #7C3AED;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .brand-text {
                    font-size: 20px;
                    font-weight: 800;
                    color: white;
                    letter-spacing: -0.03em;
                    text-transform: uppercase;
                }
                .brand-accent {
                    color: #bd9dff;
                }

                /* Header */
                .form-header {
                    margin-bottom: 24px;
                }
                .form-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.02em;
                    line-height: 1;
                    margin: 0 0 8px;
                }
                .form-subtitle {
                    font-size: 14px;
                    color: #acaab1;
                    margin: 0;
                }

                /* Divider */
                .divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                }
                .divider-text {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: rgba(172, 170, 177, 0.5);
                }

                /* ── Form ── */
                .reg-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 16px;
                    display: flex;
                    color: #acaab1;
                    pointer-events: none;
                    transition: color 0.2s;
                    z-index: 1;
                }
                .input-wrap:focus-within .input-icon {
                    color: #7C3AED;
                }
                .field-input {
                    width: 100%;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding-left: 44px;
                    padding-right: 16px;
                    font-size: 14px;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                    font-family: "Inter", sans-serif;
                }
                .field-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                .field-input:focus {
                    border-color: #7C3AED;
                    box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.4);
                }
                .field-input.field-error {
                    border-color: #ff6e84;
                }
                .field-input-pw {
                    padding-right: 48px;
                }
                .pw-toggle {
                    position: absolute;
                    right: 16px;
                    background: none;
                    border: none;
                    color: #acaab1;
                    cursor: pointer;
                    display: flex;
                    padding: 0;
                    transition: color 0.2s;
                }
                .pw-toggle:hover {
                    color: white;
                }
                .error-msg {
                    font-size: 12px;
                    color: #ff6e84;
                    margin: 0;
                    padding-left: 4px;
                }

                /* ── Strength meter ── */
                .strength-section {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 0 2px;
                }
                .strength-bars {
                    display: flex;
                    gap: 6px;
                }
                .strength-bar {
                    height: 4px;
                    flex: 1;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.1);
                    transition: background 0.3s, box-shadow 0.3s;
                }
                .strength-bar-active {
                    background: #7C3AED;
                    box-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
                }
                .strength-labels {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .strength-text {
                    font-size: 10px;
                    font-weight: 600;
                    color: #7C3AED;
                    letter-spacing: 0.05em;
                }
                .strength-hint {
                    font-size: 10px;
                    color: rgba(172, 170, 177, 0.5);
                }

                /* ── CTA Button ── */
                .cta-button {
                    width: 100%;
                    height: 52px;
                    background: #7C3AED;
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: "Inter", sans-serif;
                    animation: pulseGlow 3s infinite ease-in-out;
                    margin-top: 4px;
                }
                .cta-button:hover:not(:disabled) {
                    filter: brightness(1.1);
                    transform: translateY(-2px);
                }
                .cta-button:active:not(:disabled) {
                    transform: scale(0.98);
                }
                .cta-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    animation: none;
                }
                .cta-spinner {
                    animation: spin 1s linear infinite;
                }

                /* ── Footer ── */
                .form-footer {
                    margin-top: 28px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: center;
                }
                .footer-link-text {
                    font-size: 14px;
                    color: #acaab1;
                    margin: 0;
                }
                .footer-link {
                    color: #7C3AED;
                    font-weight: 600;
                    text-decoration: none;
                }
                .footer-link:hover {
                    text-decoration: underline;
                    text-underline-offset: 4px;
                    text-decoration-color: rgba(124, 58, 237, 0.4);
                }
                .privacy-note {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    opacity: 0.5;
                    font-size: 11px;
                    font-weight: 500;
                }

                /* ── Mobile CTA bar ── */
                .mobile-cta-bar {
                    display: block;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 16px 24px;
                    background: linear-gradient(to top, #0a0a0f 60%, transparent);
                    backdrop-filter: blur(12px);
                    z-index: 40;
                }

                /* ── Background orbs (mobile) ── */
                .bg-orbs {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }
                .orb {
                    position: absolute;
                    border-radius: 50%;
                }
                .orb-1 {
                    top: -10%;
                    left: -10%;
                    width: 50%;
                    height: 40%;
                    background: rgba(189, 157, 255, 0.05);
                    filter: blur(120px);
                }
                .orb-2 {
                    bottom: -10%;
                    right: -10%;
                    width: 50%;
                    height: 40%;
                    background: rgba(195, 139, 245, 0.05);
                    filter: blur(120px);
                }

                /* ── 3D Hero Elements ── */
                .hero-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    height: 600px;
                    background: rgba(124, 58, 237, 0.1);
                    filter: blur(120px);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .perspective-wrap {
                    width: 100%;
                    max-width: 640px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .perspective-container {
                    perspective: 1000px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .monolith-card {
                    width: 480px;
                    height: 320px;
                    border-radius: 24px;
                    padding: 32px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.1s ease-out;
                    background: linear-gradient(135deg, rgba(31, 31, 38, 0.9) 0%, rgba(14, 14, 19, 0.95) 100%);
                    backdrop-filter: blur(12px);
                    overflow: visible;
                }
                .monolith-bg {
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    overflow: hidden;
                    opacity: 0.25;
                }
                .monolith-bg-gradient {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 30%, #6d28d9 60%, #1e1b4b 100%);
                }

                /* Floating badges */
                .badge {
                    position: absolute;
                    transform: translateZ(40px);
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(8px);
                    padding: 8px 16px;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    text-transform: uppercase;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    white-space: nowrap;
                }
                .badge-icon {
                    color: #bd9dff;
                }
                .badge-3d {
                    top: -24px;
                    right: -24px;
                }
                .badge-nocode {
                    top: 50%;
                    left: -48px;
                    transform: translateY(-50%) translateZ(40px);
                }
                .badge-live {
                    bottom: -16px;
                    right: 48px;
                }

                /* Card inner content */
                .monolith-content {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .monolith-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: #7C3AED;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
                }
                .monolith-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                    margin: 0;
                }
                .monolith-bars {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    opacity: 0.6;
                }
                .bar-track {
                    height: 6px;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .bar-fill {
                    height: 100%;
                    background: #bd9dff;
                    border-radius: 9999px;
                }

                /* Social proof */
                .social-proof {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    margin-top: 80px;
                }
                .avatar-stack {
                    display: flex;
                }
                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #0a0a0f;
                    background: #1f1f26;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: -12px;
                }
                .avatar-circle:first-child {
                    margin-left: 0;
                }
                .avatar-count {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #0a0a0f;
                    background: #1f1f26;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                    color: #bd9dff;
                    margin-left: -12px;
                }
                .social-text {
                    font-size: 14px;
                    color: #acaab1;
                    font-weight: 500;
                    margin: 0;
                }
                .rating-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .stars {
                    display: flex;
                    gap: 1px;
                }
                .rating-number {
                    font-size: 14px;
                    font-weight: 700;
                    color: white;
                }
                .rating-label {
                    font-size: 12px;
                    color: #acaab1;
                    margin-left: 2px;
                }

                /* ══════ ANIMATIONS ══════ */
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 20px 4px rgba(124, 58, 237, 0.2);
                    }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* ══════ DESKTOP BREAKPOINT (≥1024px) ══════ */
                @media (min-width: 1024px) {
                    .signup-root {
                        flex-direction: row;
                    }

                    /* Show left hero panel */
                    .signup-hero {
                        display: flex;
                        width: 55%;
                        height: 100vh;
                        position: relative;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 48px;
                        background: #0a0a0f;
                        overflow: hidden;
                    }

                    /* Right panel adjustments */
                    .signup-form-panel {
                        width: 45%;
                        height: 100vh;
                        background: #131319;
                        padding: 48px 32px;
                        overflow-y: auto;
                    }

                    /* Hide mobile elements */
                    .mobile-cta-bar {
                        display: none !important;
                    }
                    .bg-orbs {
                        display: none;
                    }

                    /* Remove extra bottom padding */
                    .signup-form-panel {
                        padding-bottom: 48px;
                    }
                }

                /* ══════ MOBILE — centered heading ══════ */
                @media (max-width: 1023px) {
                    .brand-row {
                        justify-content: center;
                        margin-bottom: 32px;
                    }
                    .form-header {
                        text-align: center;
                    }
                    .form-title {
                        font-size: 26px;
                        line-height: 1.15;
                    }
                }
            `}</style>
        </div>
    );
}
