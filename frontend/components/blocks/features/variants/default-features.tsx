"use client";

import React, { useEffect } from "react";
import { FeaturesConfig } from "../schema";

function useFeaturesStyles() {
    useEffect(() => {
        const id = "builder-features-styles";
        if (document.getElementById(id)) return;

        const s = document.createElement("style");
        s.id = id;
        s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Outfit:wght@500;600;700&display=swap');

            .blk-feat-wrap {
                width: 100%;
                max-width: 1140px;
                margin: 0 auto;
                padding: 72px 24px;
                color: #f7f8ff;
                font-family: 'Manrope', sans-serif;
            }

            .blk-feat-header {
                text-align: center;
                margin-bottom: 48px;
            }

            .blk-feat-kicker {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.22em;
                color: rgba(236,239,255,0.52);
                font-weight: 700;
                font-family: 'Space Grotesk', sans-serif;
                margin-bottom: 12px;
            }

            .blk-feat-title {
                margin: 0;
                font-family: 'Outfit', sans-serif;
                font-size: clamp(28px, 4vw, 44px);
                line-height: 1.05;
                letter-spacing: -0.02em;
                color: #f7f3ec;
            }

            .blk-feat-subtitle {
                margin: 14px auto 0;
                max-width: 56ch;
                color: rgba(245,242,235,0.55);
                line-height: 1.7;
                font-size: 14px;
            }

            .blk-feat-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 18px;
            }

            .blk-feat-card {
                border-radius: 18px;
                border: 1px solid rgba(255,255,255,0.08);
                background: linear-gradient(175deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
                padding: 28px 24px;
                transition: border-color 0.3s ease, transform 0.3s ease;
            }

            .blk-feat-card:hover {
                border-color: rgba(255,255,255,0.18);
                transform: translateY(-3px);
            }

            .blk-feat-icon {
                width: 44px;
                height: 44px;
                border-radius: 12px;
                background: rgba(99,102,241,0.12);
                border: 1px solid rgba(99,102,241,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                margin-bottom: 16px;
            }

            .blk-feat-card-title {
                font-size: 16px;
                font-weight: 700;
                color: #f7f3ec;
                margin: 0 0 8px;
                font-family: 'Outfit', sans-serif;
            }

            .blk-feat-card-desc {
                font-size: 13px;
                color: rgba(245,242,235,0.55);
                line-height: 1.7;
                margin: 0;
            }
        `;
        document.head.appendChild(s);
    }, []);
}

export default function DefaultFeatures({ config }: { config: FeaturesConfig; isPreview?: boolean }) {
    useFeaturesStyles();
    const features = config.features || [];

    return (
        <section className="blk-feat-wrap" style={{ background: "#0a0a0b" }}>
            <div className="blk-feat-header">
                <div className="blk-feat-kicker">{config.kickerText}</div>
                <h2 className="blk-feat-title">{config.title}</h2>
                <p className="blk-feat-subtitle">{config.subtitle}</p>
            </div>

            <div className="blk-feat-grid">
                {features.map((feat) => (
                    <div key={feat.id} className="blk-feat-card">
                        <div className="blk-feat-icon">{feat.icon}</div>
                        <h3 className="blk-feat-card-title">{feat.title}</h3>
                        <p className="blk-feat-card-desc">{feat.description}</p>
                    </div>
                ))}
            </div>

            {features.length === 0 && (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "40px 0" }}>
                    No features configured
                </div>
            )}
        </section>
    );
}
