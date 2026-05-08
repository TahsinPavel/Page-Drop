"use client";

import React, { useRef, useEffect } from "react";
import { TestimonialsConfig } from "../schema";

function useTestimonialsStyles() {
  useEffect(() => {
    const id = "aura-testimonials-styles";
    if (document.getElementById(id)) return;

    const styleTag = document.createElement("style");
    styleTag.id = id;
    styleTag.textContent = `
      .lp1-proof-wrap {
        width: 100%;
        max-width: 1140px;
        margin: 0 auto;
        padding: 40px 24px 90px;
        color: #f7f8ff;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .lp1-proof-top {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 18px;
      }

      .lp1-section-kicker {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: rgba(236,239,255,0.62);
        margin-bottom: 8px;
      }

      .lp1-section-title {
        margin: 0;
        font-family: 'Outfit', sans-serif;
        font-size: clamp(28px, 4vw, 44px);
        line-height: 1.05;
        letter-spacing: -0.02em;
      }

      .lp1-proof-stat {
        margin-top: 10px;
        font-size: 14px;
        color: rgba(252, 210, 120, 0.98);
        font-weight: 600;
      }

      .lp1-proof-nav {
        display: flex;
        gap: 8px;
      }

      .lp1-proof-nav button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.22);
        background: rgba(255,255,255,0.06);
        color: rgba(247,249,255,0.88);
        cursor: pointer;
        transition: border-color .2s ease, transform .2s ease;
      }

      .lp1-proof-nav button:hover {
        border-color: rgba(255,255,255,0.46);
        transform: translateY(-2px);
      }

      .lp1-review-row {
        display: flex;
        overflow-x: auto;
        gap: 14px;
        scroll-snap-type: x mandatory;
        padding-bottom: 8px;
        scrollbar-width: none;
        ms-overflow-style: none;
      }

      .lp1-review-row::-webkit-scrollbar {
        display: none;
      }

      .lp1-review-card {
        min-width: min(370px, 88vw);
        scroll-snap-align: start;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.18);
        background: linear-gradient(175deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
        padding: 22px;
      }

      .lp1-review-stars {
        color: #f7bb3a;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
      }

      .lp1-review-copy {
        margin: 0 0 16px;
        font-size: 14px;
        color: rgba(241,244,255,0.76);
        line-height: 1.7;
      }

      .lp1-review-footer {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .lp1-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 13px;
        font-weight: 700;
      }
    `;

    document.head.appendChild(styleTag);
  }, []);
}

export default function DefaultTestimonials({ config, isPreview }: { config: TestimonialsConfig, isPreview?: boolean }) {
  useTestimonialsStyles();
  const testimonialRef = useRef<HTMLDivElement>(null);
  const testimonials = config.testimonials || [];

  const scrollTestimonials = (direction: number) => {
    if (!testimonialRef.current) return;
    testimonialRef.current.scrollBy({ left: direction * 390, behavior: "smooth" });
  };

  return (
    <section className="lp1-proof-wrap pointer-events-auto">
      <div style={{ animation: "lp1-fade-up .75s ease both" }}>
        <div className="lp1-proof-top">
          <div>
            <div className="lp1-section-kicker">{config.kickerText}</div>
            <h2 className="lp1-section-title">{config.title}</h2>
            <p className="lp1-proof-stat">{config.stat}</p>
          </div>
          <div className="lp1-proof-nav">
            <button type="button" onClick={() => scrollTestimonials(-1)} aria-label="Previous review">
              ‹
            </button>
            <button type="button" onClick={() => scrollTestimonials(1)} aria-label="Next review">
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="lp1-review-row" ref={testimonialRef}>
        {testimonials.map((item) => (
          <article className="lp1-review-card" key={item.id}>
            <div className="lp1-review-stars">★★★★★</div>
            <p className="lp1-review-copy">"{item.quote}"</p>
            <div className="lp1-review-footer">
              <span className="lp1-avatar" style={{ background: item.avatarColor }}>
                {item.name.charAt(0)}
              </span>
              <span>
                <strong style={{ display: "block", fontSize: 13 }}>{item.name}</strong>
                <span style={{ color: "rgba(239, 242, 255, 0.62)", fontSize: 12 }}>{item.role}</span>
              </span>
            </div>
          </article>
        ))}
        {testimonials.length === 0 && (
          <div className="text-white text-center w-full py-10 opacity-50">No testimonials configured</div>
        )}
      </div>
    </section>
  );
}
