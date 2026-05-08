"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FooterConfig } from "../schema";

function useFooterStyles() {
    useEffect(() => {
        const id = "builder-footer-styles";
        if (document.getElementById(id)) return;

        const s = document.createElement("style");
        s.id = id;
        s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

            .blk-foot-wrap {
                width: 100%;
                border-top: 1px solid rgba(255,255,255,0.06);
                background: #050506;
                padding: 48px 24px 32px;
                font-family: 'Manrope', sans-serif;
            }

            .blk-foot-inner {
                max-width: 1140px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }

            .blk-foot-brand {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .blk-foot-logo {
                width: 36px;
                height: 36px;
                border-radius: 10px;
                background: rgba(99,102,241,0.15);
                border: 1px solid rgba(99,102,241,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #a5b4fc;
            }

            .blk-foot-name {
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 0.12em;
                color: rgba(245,242,235,0.85);
                font-family: 'Space Grotesk', sans-serif;
            }

            .blk-foot-tagline {
                font-size: 13px;
                color: rgba(245,242,235,0.38);
                text-align: center;
                margin: 0;
            }

            .blk-foot-links {
                display: flex;
                gap: 24px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .blk-foot-link {
                font-size: 12px;
                color: rgba(245,242,235,0.45);
                text-decoration: none;
                transition: color 0.2s ease;
                font-weight: 500;
            }

            .blk-foot-link:hover {
                color: rgba(245,242,235,0.8);
            }

            .blk-foot-divider {
                width: 100%;
                max-width: 400px;
                height: 1px;
                background: rgba(255,255,255,0.06);
            }

            .blk-foot-bottom {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
            }

            .blk-foot-copy {
                font-size: 11px;
                color: rgba(245,242,235,0.28);
            }

            .blk-foot-powered {
                font-size: 11px;
                color: rgba(245,242,235,0.22);
            }

            .blk-foot-powered a {
                color: rgba(99,102,241,0.6);
                text-decoration: none;
            }

            .blk-foot-powered a:hover {
                color: rgba(99,102,241,0.9);
            }
        `;
        document.head.appendChild(s);
    }, []);
}

export default function DefaultFooter({ config }: { config: FooterConfig; isPreview?: boolean }) {
    useFooterStyles();
    const year = new Date().getFullYear();

    return (
        <footer className="blk-foot-wrap">
            <div className="blk-foot-inner">
                <div className="blk-foot-brand">
                    <div className="blk-foot-logo">{config.brandLogoText}</div>
                    <span className="blk-foot-name">{config.brandName}</span>
                </div>

                <p className="blk-foot-tagline">{config.tagline}</p>

                {config.links && config.links.length > 0 && (
                    <div className="blk-foot-links">
                        {config.links.map((link) => (
                            <a key={link.id} href={link.url} className="blk-foot-link">
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}

                <div className="blk-foot-divider" />

                <div className="blk-foot-bottom">
                    <span className="blk-foot-copy">
                        © {year} {config.brandName}. {config.copyrightText}
                    </span>
                    {config.showPoweredBy && (
                        <span className="blk-foot-powered">
                            • Built with <Link href="/">PageDrop</Link>
                        </span>
                    )}
                </div>
            </div>
        </footer>
    );
}
