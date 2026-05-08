"use client";

import React, { useEffect, useState } from "react";
import { CTAConfig } from "../schema";

function useCTAStyles() {
    useEffect(() => {
        const id = "builder-cta-styles";
        if (document.getElementById(id)) return;

        const s = document.createElement("style");
        s.id = id;
        s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Outfit:wght@500;600;700&display=swap');

            .blk-cta-wrap {
                width: 100%;
                max-width: 720px;
                margin: 0 auto;
                padding: 72px 24px;
                text-align: center;
                font-family: 'Manrope', sans-serif;
            }

            .blk-cta-kicker {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.22em;
                color: rgba(236,239,255,0.52);
                font-weight: 700;
                font-family: 'Space Grotesk', sans-serif;
                margin-bottom: 14px;
            }

            .blk-cta-headline {
                margin: 0 0 12px;
                font-family: 'Outfit', sans-serif;
                font-size: clamp(32px, 5vw, 52px);
                line-height: 1.05;
                letter-spacing: -0.02em;
                color: #f7f3ec;
            }

            .blk-cta-sub {
                margin: 0 0 32px;
                font-size: 15px;
                color: rgba(245,242,235,0.55);
                line-height: 1.7;
                max-width: 50ch;
                margin-left: auto;
                margin-right: auto;
            }

            .blk-cta-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 16px 36px;
                background: #25D366;
                color: #fff;
                border: none;
                border-radius: 14px;
                font-size: 15px;
                font-weight: 800;
                font-family: 'Manrope', sans-serif;
                cursor: pointer;
                letter-spacing: 0.01em;
                transition: all .35s cubic-bezier(0.22, 1, 0.36, 1);
                box-shadow: 0 8px 28px rgba(37,211,102,.28);
            }

            .blk-cta-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 14px 44px rgba(37,211,102,.42);
                background: linear-gradient(135deg, #25D366 0%, #20ba5a 100%);
            }

            .blk-cta-badges {
                display: flex;
                justify-content: center;
                gap: 12px;
                margin-top: 24px;
                flex-wrap: wrap;
            }

            .blk-cta-badge {
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.04);
                border-radius: 999px;
                padding: 6px 16px;
                font-size: 12px;
                color: rgba(245,242,235,0.65);
                font-weight: 600;
            }

            .blk-cta-note {
                margin-top: 16px;
                font-size: 12px;
                color: rgba(245,242,235,0.38);
            }
        `;
        document.head.appendChild(s);
    }, []);
}

export default function DefaultCTA({ config }: { config: CTAConfig; isPreview?: boolean }) {
    useCTAStyles();
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        const num = config.whatsappNumber || "";
        const msg = encodeURIComponent(config.whatsappMessage || "Hi, I'd like to place an order.");
        window.open(`https://wa.me/${num.replace(/\D/g, "")}?text=${msg}`, "_blank");
    };

    return (
        <section style={{ background: "#0a0a0b" }}>
            <div className="blk-cta-wrap">
                <div className="blk-cta-kicker">{config.kickerText}</div>
                <h2 className="blk-cta-headline">{config.headline}</h2>
                <p className="blk-cta-sub">{config.subheadline}</p>

                <button
                    className="blk-cta-btn"
                    onClick={handleClick}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={hovered ? { transform: "translateY(-3px)", boxShadow: "0 14px 44px rgba(37,211,102,.42)" } : {}}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                    {config.buttonText}
                </button>

                {config.showBadges && config.badges && config.badges.length > 0 && (
                    <div className="blk-cta-badges">
                        {config.badges.map((badge, i) => (
                            <span key={i} className="blk-cta-badge">{badge}</span>
                        ))}
                    </div>
                )}

                <p className="blk-cta-note">No payment required now • Ask anything first</p>
            </div>
        </section>
    );
}
