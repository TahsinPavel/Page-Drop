"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    X,
    CreditCard,
    Wallet,
    ArrowLeft,
    Copy,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Check,
    Loader2,
} from "lucide-react";
import { createNOWPaymentsInvoice, checkNOWPaymentsStatus } from "@/lib/api";
import type { NOWPaymentsInvoice } from "@/types";

/* ── Types ── */

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: "pro" | "business";
}

type PaymentStep =
    | "select"
    | "crypto_invoice"
    | "crypto_polling"
    | "success"
    | "error";

const STATUS_LABELS: Record<string, { color: string; label: string }> = {
    waiting: { color: "#9CA3AF", label: "Waiting for transaction" },
    confirming: { color: "#F59E0B", label: "Transaction detected — confirming" },
    confirmed: { color: "#3B82F6", label: "Confirmed — finalizing" },
    sending: { color: "#6366F1", label: "Processing" },
};

/* ── Component ── */

export default function PaymentMethodModal({
    isOpen,
    onClose,
    plan,
}: PaymentMethodModalProps) {
    const router = useRouter();
    const price = plan === "pro" ? 12 : 29;

    const [step, setStep] = useState<PaymentStep>("select");
    const [invoice, setInvoice] = useState<NOWPaymentsInvoice | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string>("waiting");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [copied, setCopied] = useState(false);
    const [gumroadNote, setGumroadNote] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    /* Reset on open/close */
    useEffect(() => {
        if (!isOpen) {
            setStep("select");
            setInvoice(null);
            setPaymentStatus("waiting");
            setLoading(false);
            setErrorMessage("");
            setCopied(false);
            setGumroadNote(false);
        }
    }, [isOpen]);

    /* Escape key close (select/success/error only) */
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (
                e.key === "Escape" &&
                ["select", "success", "error"].includes(step)
            ) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, step, onClose]);

    /* Invoice expiry timer */
    useEffect(() => {
        if (step !== "crypto_invoice" || !invoice?.expiration_estimate_date)
            return;
        const target = new Date(invoice.expiration_estimate_date).getTime();
        const tick = setInterval(() => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setTimeLeft("Expired");
                clearInterval(tick);
                return;
            }
            const h = Math.floor(diff / 3_600_000);
            const m = Math.floor((diff % 3_600_000) / 60_000);
            const s = Math.floor((diff % 60_000) / 1_000);
            setTimeLeft(
                `${h.toString().padStart(2, "0")}:${m
                    .toString()
                    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
            );
        }, 1000);
        return () => clearInterval(tick);
    }, [step, invoice]);

    /* Polling */
    useEffect(() => {
        if (step !== "crypto_polling" || !invoice) return;
        const poll = setInterval(async () => {
            try {
                const status = await checkNOWPaymentsStatus(
                    invoice.payment_id
                );
                setPaymentStatus(status.payment_status);
                if (status.payment_status === "finished") {
                    clearInterval(poll);
                    setStep("success");
                }
                if (["failed", "expired"].includes(status.payment_status)) {
                    clearInterval(poll);
                    setErrorMessage(
                        status.payment_status === "expired"
                            ? "Payment invoice expired. Please create a new payment."
                            : "Payment failed. Please try again."
                    );
                    setStep("error");
                }
            } catch {
                /* silent — keep polling */
            }
        }, 10_000);
        return () => clearInterval(poll);
    }, [step, invoice]);

    /* Handlers */
    const handleCryptoPayment = useCallback(async () => {
        setLoading(true);
        try {
            const inv = await createNOWPaymentsInvoice(plan);
            setInvoice(inv);
            setStep("crypto_invoice");
        } catch {
            setErrorMessage(
                "Failed to create payment invoice. Please try again."
            );
            setStep("error");
        } finally {
            setLoading(false);
        }
    }, [plan]);

    const handleCopyAddress = useCallback(() => {
        if (!invoice) return;
        navigator.clipboard.writeText(invoice.pay_address).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    }, [invoice]);

    const handleGumroad = useCallback(() => {
        const url =
            plan === "pro"
                ? process.env.NEXT_PUBLIC_GUMROAD_PRO_URL
                : process.env.NEXT_PUBLIC_GUMROAD_BUSINESS_URL;
        if (url) window.open(url, "_blank");
        setGumroadNote(true);
    }, [plan]);

    if (!isOpen) return null;

    const canClose = ["select", "success", "error"].includes(step);

    /* ── Overlay ── */
    return (
        <>
            {/* Overlay */}
            <div
                onClick={canClose ? onClose : undefined}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 50,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                }}
            />

            {/* Card */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 51,
                    width: "min(520px, 92vw)",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "var(--pd-bg-elevated)",
                    border: "1px solid var(--pd-border)",
                    borderRadius: 20,
                    padding: "32px",
                }}
            >
                {/* ═════════ STEP: select ═════════ */}
                {step === "select" && (
                    <>
                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--pd-text-tertiary)",
                            }}
                        >
                            <X size={20} />
                        </button>

                        {/* Plan badge */}
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                padding: "4px 12px",
                                borderRadius: 9999,
                                background: "rgba(99,102,241,0.12)",
                                color: "#818CF8",
                            }}
                        >
                            {plan.toUpperCase()} PLAN
                        </span>

                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "var(--pd-text-primary)",
                                marginTop: 12,
                            }}
                        >
                            Choose Payment Method
                        </h2>

                        {/* Price */}
                        <div style={{ marginTop: 4 }}>
                            <span
                                style={{
                                    fontSize: 40,
                                    fontWeight: 800,
                                    background:
                                        "var(--pd-gradient-hero, linear-gradient(135deg,#6366F1,#10B981))",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                ${price}
                            </span>
                            <span
                                style={{
                                    fontSize: 16,
                                    color: "var(--pd-text-secondary)",
                                    marginLeft: 4,
                                }}
                            >
                                / month
                            </span>
                        </div>

                        {/* Payment option cards grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 16,
                                marginTop: 24,
                            }}
                        >
                            {/* ── Card 1: Gumroad ── */}
                            <div
                                style={{
                                    background: "var(--pd-bg-secondary)",
                                    border: "1px solid var(--pd-border)",
                                    borderRadius: 14,
                                    padding: 20,
                                    cursor: "pointer",
                                    transition: "all 150ms ease",
                                    textAlign: "center",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--pd-border-accent)";
                                    e.currentTarget.style.background =
                                        "rgba(99,102,241,0.04)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--pd-border)";
                                    e.currentTarget.style.background =
                                        "var(--pd-bg-secondary)";
                                }}
                            >
                                <CreditCard
                                    size={24}
                                    color="#6366F1"
                                    style={{ margin: "0 auto" }}
                                />
                                <p
                                    style={{
                                        fontWeight: 600,
                                        color: "var(--pd-text-primary)",
                                        marginTop: 12,
                                        fontSize: 15,
                                    }}
                                >
                                    Pay by Card
                                </p>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "var(--pd-text-secondary)",
                                        marginTop: 4,
                                    }}
                                >
                                    Via Gumroad secure checkout
                                </p>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "12px 0 0",
                                        textAlign: "left",
                                    }}
                                >
                                    {[
                                        "Visa, Mastercard, PayPal",
                                        "Recurring billing",
                                        "Instant activation",
                                    ].map((f) => (
                                        <li
                                            key={f}
                                            style={{
                                                fontSize: 12,
                                                color: "var(--pd-text-secondary)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                marginTop: 4,
                                            }}
                                        >
                                            <Check
                                                size={13}
                                                color="#10B981"
                                            />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={handleGumroad}
                                    style={{
                                        marginTop: 16,
                                        width: "100%",
                                        padding: "10px 0",
                                        borderRadius: 10,
                                        border: "1px solid var(--pd-border)",
                                        background: "white",
                                        color: "#1a1a1a",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: "pointer",
                                        transition: "all 150ms ease",
                                    }}
                                >
                                    Pay ${price} with Card →
                                </button>
                                {gumroadNote && (
                                    <p
                                        style={{
                                            fontSize: 11,
                                            color: "var(--pd-text-tertiary)",
                                            marginTop: 8,
                                            textAlign: "center",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        After payment, reply to Gumroad email
                                        with your PageDrop account email to
                                        activate.
                                    </p>
                                )}
                            </div>

                            {/* ── Card 2: NOWPayments ── */}
                            <div
                                style={{
                                    background: "var(--pd-bg-secondary)",
                                    border: "1px solid var(--pd-border)",
                                    borderRadius: 14,
                                    padding: 20,
                                    cursor: "pointer",
                                    transition: "all 150ms ease",
                                    textAlign: "center",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--pd-border-accent)";
                                    e.currentTarget.style.background =
                                        "rgba(99,102,241,0.04)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--pd-border)";
                                    e.currentTarget.style.background =
                                        "var(--pd-bg-secondary)";
                                }}
                            >
                                <Wallet
                                    size={24}
                                    color="#F59E0B"
                                    style={{ margin: "0 auto" }}
                                />
                                <p
                                    style={{
                                        fontWeight: 600,
                                        color: "var(--pd-text-primary)",
                                        marginTop: 12,
                                        fontSize: 15,
                                    }}
                                >
                                    Pay with USDT
                                </p>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "var(--pd-text-secondary)",
                                        marginTop: 4,
                                    }}
                                >
                                    TRC-20 network · Lowest fees
                                </p>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "12px 0 0",
                                        textAlign: "left",
                                    }}
                                >
                                    {[
                                        "USDT TRC-20 (Tron)",
                                        "~$0.50 network fee",
                                        "Instant activation",
                                        "Any crypto wallet",
                                    ].map((f) => (
                                        <li
                                            key={f}
                                            style={{
                                                fontSize: 12,
                                                color: "var(--pd-text-secondary)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                marginTop: 4,
                                            }}
                                        >
                                            <Check
                                                size={13}
                                                color="#10B981"
                                            />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={handleCryptoPayment}
                                    disabled={loading}
                                    style={{
                                        marginTop: 16,
                                        width: "100%",
                                        padding: "10px 0",
                                        borderRadius: 10,
                                        border: "none",
                                        background:
                                            "var(--pd-gradient-hero, linear-gradient(135deg,#6366F1,#10B981))",
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: loading
                                            ? "wait"
                                            : "pointer",
                                        opacity: loading ? 0.7 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        transition: "all 150ms ease",
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Creating invoice…
                                        </>
                                    ) : (
                                        `Pay $${price} with USDT →`
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ═════════ STEP: crypto_invoice ═════════ */}
                {step === "crypto_invoice" && invoice && (
                    <>
                        <button
                            onClick={() => setStep("select")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "none",
                                border: "none",
                                color: "var(--pd-text-secondary)",
                                fontSize: 13,
                                cursor: "pointer",
                                marginBottom: 16,
                            }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "var(--pd-text-primary)",
                            }}
                        >
                            Send USDT Payment
                        </h2>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--pd-text-secondary)",
                                marginTop: 4,
                            }}
                        >
                            Send exactly the amount below to activate your plan
                        </p>

                        {/* Payment details card */}
                        <div
                            style={{
                                marginTop: 20,
                                background: "var(--pd-bg-secondary)",
                                border: "1px solid var(--pd-border)",
                                borderRadius: 16,
                                padding: 24,
                            }}
                        >
                            {/* Amount */}
                            <div>
                                <p
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "var(--pd-text-tertiary)",
                                    }}
                                >
                                    EXACT AMOUNT TO SEND
                                </p>
                                <p
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 800,
                                        color: "var(--pd-text-primary)",
                                        marginTop: 4,
                                    }}
                                >
                                    {invoice.pay_amount} USDT
                                </p>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: "#F59E0B",
                                        marginTop: 4,
                                    }}
                                >
                                    ⚠ Send the exact amount shown
                                </p>
                            </div>

                            <hr
                                style={{
                                    border: "none",
                                    borderTop:
                                        "1px solid var(--pd-border)",
                                    margin: "16px 0",
                                }}
                            />

                            {/* Address */}
                            <div>
                                <p
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "var(--pd-text-tertiary)",
                                    }}
                                >
                                    SEND TO ADDRESS (TRC-20 ONLY)
                                </p>
                                <div
                                    style={{
                                        marginTop: 8,
                                        fontFamily:
                                            "var(--font-jetbrains-mono, monospace)",
                                        fontSize: 13,
                                        color: "#a5b4fc",
                                        background:
                                            "rgba(99,102,241,0.08)",
                                        border: "1px solid rgba(99,102,241,0.2)",
                                        borderRadius: 10,
                                        padding: "12px 16px",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {invoice.pay_address}
                                </div>
                                <button
                                    onClick={handleCopyAddress}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        background: "none",
                                        border: "none",
                                        fontSize: 12,
                                        color: copied
                                            ? "#10B981"
                                            : "var(--pd-text-secondary)",
                                        cursor: "pointer",
                                        marginTop: 8,
                                    }}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle size={14} /> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} /> Copy Address
                                        </>
                                    )}
                                </button>
                            </div>

                            <hr
                                style={{
                                    border: "none",
                                    borderTop:
                                        "1px solid var(--pd-border)",
                                    margin: "16px 0",
                                }}
                            />

                            {/* Network warning */}
                            <div
                                style={{
                                    background: "rgba(245,158,11,0.1)",
                                    border: "1px solid rgba(245,158,11,0.25)",
                                    borderRadius: 10,
                                    padding: 12,
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "flex-start",
                                }}
                            >
                                <AlertTriangle
                                    size={16}
                                    color="#F59E0B"
                                    style={{ flexShrink: 0, marginTop: 1 }}
                                />
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "#FBBF24",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Only send USDT on the TRC-20 (Tron) network.
                                    Sending on other networks will result in
                                    loss of funds.
                                </p>
                            </div>
                        </div>

                        {/* Timer */}
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: 13,
                                color: timeLeft === "Expired" || (timeLeft && parseInt(timeLeft) === 0 && timeLeft.startsWith("00:0"))
                                    ? "#EF4444"
                                    : "var(--pd-text-secondary)",
                                marginTop: 16,
                                fontFamily:
                                    "var(--font-jetbrains-mono, monospace)",
                            }}
                        >
                            {timeLeft === "Expired" ? (
                                <>
                                    Invoice expired —{" "}
                                    <button
                                        onClick={() => {
                                            setStep("select");
                                            setInvoice(null);
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#6366F1",
                                            cursor: "pointer",
                                            fontSize: 13,
                                            textDecoration: "underline",
                                        }}
                                    >
                                        Create New Invoice
                                    </button>
                                </>
                            ) : (
                                `Invoice expires in: ${timeLeft}`
                            )}
                        </p>

                        {/* CTA */}
                        <button
                            onClick={() => setStep("crypto_polling")}
                            style={{
                                marginTop: 16,
                                width: "100%",
                                padding: "12px 0",
                                borderRadius: 10,
                                border: "none",
                                background: "var(--pd-accent-primary)",
                                color: "white",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                transition: "all 150ms ease",
                            }}
                        >
                            Check Payment Status →
                        </button>
                    </>
                )}

                {/* ═════════ STEP: crypto_polling ═════════ */}
                {step === "crypto_polling" && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "40px 0",
                            textAlign: "center",
                        }}
                    >
                        {/* Spinner */}
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                border: "3px solid rgba(99,102,241,0.2)",
                                borderTop: "3px solid #6366F1",
                                animation: "spin 1s linear infinite",
                            }}
                        />

                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "var(--pd-text-primary)",
                                marginTop: 20,
                            }}
                        >
                            Waiting for Payment
                        </h2>

                        {/* Status badge */}
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 12,
                                padding: "6px 14px",
                                borderRadius: 9999,
                                fontSize: 13,
                                fontWeight: 500,
                                background: `${STATUS_LABELS[paymentStatus]?.color ?? "#9CA3AF"}15`,
                                color:
                                    STATUS_LABELS[paymentStatus]?.color ??
                                    "#9CA3AF",
                                border: `1px solid ${STATUS_LABELS[paymentStatus]?.color ?? "#9CA3AF"}30`,
                            }}
                        >
                            {STATUS_LABELS[paymentStatus]?.label ??
                                paymentStatus}
                        </span>

                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--pd-text-secondary)",
                                marginTop: 8,
                            }}
                        >
                            This usually takes 1–3 minutes on TRC-20 network.
                        </p>

                        <p
                            style={{
                                fontSize: 11,
                                color: "var(--pd-text-tertiary)",
                                marginTop: 16,
                            }}
                        >
                            Checking automatically every 10 seconds
                        </p>

                        <button
                            onClick={() => setStep("crypto_invoice")}
                            style={{
                                marginTop: 24,
                                background: "none",
                                border: "none",
                                color: "var(--pd-text-secondary)",
                                fontSize: 13,
                                cursor: "pointer",
                                textDecoration: "none",
                                transition: "color 150ms ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration =
                                    "underline";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = "none";
                            }}
                        >
                            Back to payment details
                        </button>
                    </div>
                )}

                {/* ═════════ STEP: success ═════════ */}
                {step === "success" && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "48px 0",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                background: "rgba(16,185,129,0.15)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                animation:
                                    "scaleIn 300ms ease forwards",
                            }}
                        >
                            <CheckCircle size={40} color="#10B981" />
                        </div>

                        <h2
                            style={{
                                fontSize: 24,
                                fontWeight: 800,
                                color: "var(--pd-text-primary)",
                                marginTop: 20,
                            }}
                        >
                            Payment Confirmed! 🎉
                        </h2>
                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--pd-text-secondary)",
                                maxWidth: 300,
                                marginTop: 8,
                            }}
                        >
                            Your{" "}
                            {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
                            is now active. Enjoy advanced analytics and all Pro
                            features.
                        </p>

                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                marginTop: 20,
                                textAlign: "left",
                                maxWidth: 240,
                                width: "100%",
                            }}
                        >
                            {[
                                "Advanced analytics charts",
                                "Traffic & referrer data",
                                "Pro badge on your account",
                            ].map((f) => (
                                <li
                                    key={f}
                                    style={{
                                        fontSize: 13,
                                        color: "var(--pd-text-secondary)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginTop: 6,
                                    }}
                                >
                                    <Check size={14} color="#10B981" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => {
                                onClose();
                                router.push("/dashboard");
                            }}
                            style={{
                                marginTop: 24,
                                width: "100%",
                                maxWidth: 280,
                                padding: "12px 0",
                                borderRadius: 10,
                                border: "none",
                                background: "var(--pd-accent-primary)",
                                color: "white",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                )}

                {/* ═════════ STEP: error ═════════ */}
                {step === "error" && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "40px 0",
                            textAlign: "center",
                        }}
                    >
                        <XCircle size={48} color="#F87171" />

                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "var(--pd-text-primary)",
                                marginTop: 16,
                            }}
                        >
                            Payment Error
                        </h2>
                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--pd-text-secondary)",
                                marginTop: 8,
                                maxWidth: 280,
                            }}
                        >
                            {errorMessage}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                marginTop: 24,
                                maxWidth: 240,
                                width: "100%",
                            }}
                        >
                            <button
                                onClick={() => {
                                    setStep("select");
                                    setErrorMessage("");
                                    setInvoice(null);
                                    setPaymentStatus("waiting");
                                }}
                                style={{
                                    width: "100%",
                                    padding: "11px 0",
                                    borderRadius: 10,
                                    border: "none",
                                    background: "var(--pd-accent-primary)",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: "pointer",
                                }}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() =>
                                    window.open("/contact", "_blank")
                                }
                                style={{
                                    width: "100%",
                                    padding: "10px 0",
                                    borderRadius: 10,
                                    border: "1px solid var(--pd-border)",
                                    background: "transparent",
                                    color: "var(--pd-text-secondary)",
                                    fontSize: 14,
                                    cursor: "pointer",
                                }}
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Keyframe for spinner + scale-in */}
            <style jsx global>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
}
