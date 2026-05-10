"use client";

import React, { useState } from "react";
import { Settings2, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useBuilderStore } from "@/lib/builder/store";

// ─── Reusable field components ────────────────────────────────────────────────

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      {hint && <p className="text-[10px] text-slate-600 mt-0.5">{hint}</p>}
    </div>
  );
}

function TextInput({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0b] border border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
      />
    </div>
  );
}

function TextAreaInput({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-[#0a0a0b] border border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700 resize-none"
      />
    </div>
  );
}

function ColorInput({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel label={label} />
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value ?? "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-md border border-[#2a2a2c] bg-transparent cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#0a0a0b] border border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function SectionHeader({
  title, expanded, onToggle,
}: { title: string; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#111112] transition-colors border-b border-[#1f1f22]"
    >
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
      {expanded
        ? <ChevronDown size={12} className="text-slate-500" />
        : <ChevronRight size={12} className="text-slate-500" />}
    </button>
  );
}

// ─── Product list editor ──────────────────────────────────────────────────────

type Product = {
  id: string | number;
  name: string;
  tagline: string;
  price: string;
  badge: string;
  badgeColor: string;
  image: string;
};

function ProductListEditor({
  products,
  onChange,
}: { products: Product[]; onChange: (products: Product[]) => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const update = (idx: number, key: keyof Product, val: string) => {
    const next = products.map((p, i) =>
      i === idx ? { ...p, [key]: val } : p
    );
    onChange(next);
  };

  const add = () => {
    const blank: Product = {
      id: Date.now(),
      name: "New Product",
      tagline: "Product description here",
      price: "$0",
      badge: "NEW",
      badgeColor: "#6366f1",
      image: "",
    };
    onChange([...products, blank]);
    setExpandedIdx(products.length);
  };

  const remove = (idx: number) => {
    onChange(products.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  return (
    <div className="space-y-2">
      {products.map((p, idx) => (
        <div key={p.id} className="border border-[#2a2a2c] rounded-lg overflow-hidden">
          {/* Product row header */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 bg-[#111112] cursor-pointer hover:bg-[#1a1a1c] transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-7 h-7 rounded object-contain bg-[#0a0a0b] shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-7 h-7 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px] font-bold shrink-0">
                {idx + 1}
              </div>
            )}
            <span className="flex-1 text-xs font-semibold text-slate-200 truncate">{p.name || "Untitled"}</span>
            <button
              onClick={(e) => { e.stopPropagation(); remove(idx); }}
              className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0"
            >
              <Trash2 size={12} />
            </button>
            {expandedIdx === idx
              ? <ChevronDown size={12} className="text-slate-500 shrink-0" />
              : <ChevronRight size={12} className="text-slate-500 shrink-0" />}
          </div>

          {/* Product fields */}
          {expandedIdx === idx && (
            <div className="p-3 space-y-3 bg-[#0d0d0f] border-t border-[#2a2a2c]">
              <TextInput
                label="Product Name"
                value={p.name}
                onChange={(v) => update(idx, "name", v)}
                placeholder="e.g. Aura Studio Pro"
              />
              <TextAreaInput
                label="Description"
                value={p.tagline}
                onChange={(v) => update(idx, "tagline", v)}
                placeholder="Short product description"
              />
              <TextInput
                label="Price"
                value={p.price}
                onChange={(v) => update(idx, "price", v)}
                placeholder="$349"
              />
              <TextInput
                label="Product Image URL"
                value={p.image}
                onChange={(v) => update(idx, "image", v)}
                placeholder="/demo/product.png"
                hint="Paste a URL or a path from /public"
              />
              {p.image && (
                <img
                  src={p.image}
                  alt="preview"
                  className="w-full h-24 object-contain bg-[#111112] rounded-lg border border-[#2a2a2c]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Badge Text"
                  value={p.badge}
                  onChange={(v) => update(idx, "badge", v)}
                  placeholder="IN STOCK"
                />
                <ColorInput
                  label="Badge Color"
                  value={p.badgeColor}
                  onChange={(v) => update(idx, "badgeColor", v)}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#2a2a2c] rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:border-[#3a3a3c] transition-colors"
      >
        <Plus size={13} /> Add Product
      </button>
    </div>
  );
}

// ─── Feature list editor ──────────────────────────────────────────────────────

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

function FeatureListEditor({
  features,
  onChange,
}: { features: Feature[]; onChange: (f: Feature[]) => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const update = (idx: number, key: keyof Feature, val: string) => {
    onChange(features.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  };

  const add = () => {
    const blank: Feature = {
      id: String(Date.now()),
      icon: "◆",
      title: "New Feature",
      description: "Feature description here",
    };
    onChange([...features, blank]);
    setExpandedIdx(features.length);
  };

  const remove = (idx: number) => {
    onChange(features.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  return (
    <div className="space-y-2">
      {features.map((f, idx) => (
        <div key={f.id} className="border border-[#2a2a2c] rounded-lg overflow-hidden">
          <div
            className="flex items-center gap-2 px-3 py-2.5 bg-[#111112] cursor-pointer hover:bg-[#1a1a1c] transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <span className="text-base shrink-0">{f.icon || "◆"}</span>
            <span className="flex-1 text-xs font-semibold text-slate-200 truncate">{f.title || "Untitled"}</span>
            <button
              onClick={(e) => { e.stopPropagation(); remove(idx); }}
              className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0"
            >
              <Trash2 size={12} />
            </button>
            {expandedIdx === idx
              ? <ChevronDown size={12} className="text-slate-500 shrink-0" />
              : <ChevronRight size={12} className="text-slate-500 shrink-0" />}
          </div>
          {expandedIdx === idx && (
            <div className="p-3 space-y-3 bg-[#0d0d0f] border-t border-[#2a2a2c]">
              <TextInput label="Icon / Emoji" value={f.icon} onChange={(v) => update(idx, "icon", v)} placeholder="◆" />
              <TextInput label="Title" value={f.title} onChange={(v) => update(idx, "title", v)} placeholder="Feature title" />
              <TextAreaInput label="Description" value={f.description} onChange={(v) => update(idx, "description", v)} placeholder="Feature description" />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#2a2a2c] rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:border-[#3a3a3c] transition-colors"
      >
        <Plus size={13} /> Add Feature
      </button>
    </div>
  );
}

// ─── Review list editor ───────────────────────────────────────────────────────

type Review = { name: string; text: string };

function ReviewListEditor({
  reviews,
  onChange,
}: { reviews: Review[]; onChange: (r: Review[]) => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const update = (idx: number, key: keyof Review, val: string) => {
    onChange(reviews.map((r, i) => i === idx ? { ...r, [key]: val } : r));
  };

  const add = () => {
    onChange([...reviews, { name: "Customer Name", text: "Review text here" }]);
    setExpandedIdx(reviews.length);
  };

  const remove = (idx: number) => {
    onChange(reviews.filter((_, i) => i !== idx));
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  return (
    <div className="space-y-2">
      {reviews.map((r, idx) => (
        <div key={idx} className="border border-[#2a2a2c] rounded-lg overflow-hidden">
          <div
            className="flex items-center gap-2 px-3 py-2.5 bg-[#111112] cursor-pointer hover:bg-[#1a1a1c] transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <span className="text-xs text-yellow-400 shrink-0">⭐</span>
            <span className="flex-1 text-xs font-semibold text-slate-200 truncate">{r.name || "Reviewer"}</span>
            <button
              onClick={(e) => { e.stopPropagation(); remove(idx); }}
              className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0"
            >
              <Trash2 size={12} />
            </button>
            {expandedIdx === idx
              ? <ChevronDown size={12} className="text-slate-500 shrink-0" />
              : <ChevronRight size={12} className="text-slate-500 shrink-0" />}
          </div>
          {expandedIdx === idx && (
            <div className="p-3 space-y-3 bg-[#0d0d0f] border-t border-[#2a2a2c]">
              <TextInput label="Customer Name" value={r.name} onChange={(v) => update(idx, "name", v)} />
              <TextAreaInput label="Review Text" value={r.text} onChange={(v) => update(idx, "text", v)} />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#2a2a2c] rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:border-[#3a3a3c] transition-colors"
      >
        <Plus size={13} /> Add Review
      </button>
    </div>
  );
}

// ─── Badge list editor ────────────────────────────────────────────────────────

function BadgeListEditor({
  badges,
  onChange,
}: { badges: string[]; onChange: (b: string[]) => void }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    if (!draft.trim()) return;
    onChange([...badges, draft.trim()]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {badges.map((b, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 bg-[#1a1a1c] border border-[#2a2a2c] rounded-full px-3 py-1 text-xs text-slate-300"
          >
            {b}
            <button
              onClick={() => onChange(badges.filter((_, i) => i !== idx))}
              className="text-slate-600 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add badge, press Enter"
          className="flex-1 bg-[#0a0a0b] border border-[#2a2a2c] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
        />
        <button
          onClick={add}
          className="px-3 py-2 bg-[#1a1a1c] border border-[#2a2a2c] rounded-lg text-slate-400 hover:text-white hover:border-[#3a3a3c] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Per-block settings panels ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeroSettings({ config, update }: { config: Record<string, any>; update: (k: string, v: unknown) => void }) {
  const [sections, setSections] = useState({ brand: true, copy: true, carousel: true, cta: true });
  const toggle = (k: keyof typeof sections) => setSections(s => ({ ...s, [k]: !s[k] }));

  return (
    <>
      {/* Brand */}
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Brand" expanded={sections.brand} onToggle={() => toggle("brand")} />
        {sections.brand && (
          <div className="p-4 space-y-3">
            <TextInput label="Brand Name" value={config.brandName} onChange={v => update("brandName", v)} placeholder="AURA" />
            <TextInput label="Logo Symbol" value={config.brandLogoText} onChange={v => update("brandLogoText", v)} placeholder="✦" hint="Single character shown in the brand mark" />
            <TextInput label="Trust Badge Text" value={config.trustedText} onChange={v => update("trustedText", v)} placeholder="⭐ Trusted by 1,000+ customers" />
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Headlines & Copy" expanded={sections.copy} onToggle={() => toggle("copy")} />
        {sections.copy && (
          <div className="p-4 space-y-3">
            <TextInput label="Kicker Text" value={config.kickerText} onChange={v => update("kickerText", v)} placeholder="LIMITED EDITION DROP" hint="Small uppercase label above the headline" />
            <TextInput label="Main Headline" value={config.headline} onChange={v => update("headline", v)} placeholder="Your main headline" />
            <TextAreaInput label="Sub-headline" value={config.subheadline} onChange={v => update("subheadline", v)} placeholder="Supporting text below headline" />
          </div>
        )}
      </div>

      {/* 3D Carousel Products */}
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="🎠 3D Carousel — Products" expanded={sections.carousel} onToggle={() => toggle("carousel")} />
        {sections.carousel && (
          <div className="p-4">
            <p className="text-[10px] text-slate-500 mb-3">Each product appears as a card in the 3D carousel. Click a product to expand and edit.</p>
            <ProductListEditor
              products={config.products ?? []}
              onChange={v => update("products", v)}
            />
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="CTA / WhatsApp" expanded={sections.cta} onToggle={() => toggle("cta")} />
        {sections.cta && (
          <div className="p-4 space-y-3">
            <TextInput
              label="WhatsApp Number"
              value={config.whatsappNumber}
              onChange={v => update("whatsappNumber", v)}
              placeholder="+1234567890"
              hint="Include country code. Customers tap to open WhatsApp."
            />
          </div>
        )}
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FeaturesSettings({ config, update }: { config: Record<string, any>; update: (k: string, v: unknown) => void }) {
  const [sections, setSections] = useState({ copy: true, items: true });
  const toggle = (k: keyof typeof sections) => setSections(s => ({ ...s, [k]: !s[k] }));

  return (
    <>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Section Copy" expanded={sections.copy} onToggle={() => toggle("copy")} />
        {sections.copy && (
          <div className="p-4 space-y-3">
            <TextInput label="Section Label" value={config.kickerText} onChange={v => update("kickerText", v)} placeholder="WHY CHOOSE US" />
            <TextInput label="Title" value={config.title} onChange={v => update("title", v)} placeholder="Section title" />
            <TextAreaInput label="Subtitle" value={config.subtitle} onChange={v => update("subtitle", v)} placeholder="Section subtitle" />
          </div>
        )}
      </div>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Feature Cards" expanded={sections.items} onToggle={() => toggle("items")} />
        {sections.items && (
          <div className="p-4">
            <FeatureListEditor
              features={config.features ?? []}
              onChange={v => update("features", v)}
            />
          </div>
        )}
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CTASettings({ config, update }: { config: Record<string, any>; update: (k: string, v: unknown) => void }) {
  const [sections, setSections] = useState({ copy: true, button: true, badges: true });
  const toggle = (k: keyof typeof sections) => setSections(s => ({ ...s, [k]: !s[k] }));

  return (
    <>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Copy" expanded={sections.copy} onToggle={() => toggle("copy")} />
        {sections.copy && (
          <div className="p-4 space-y-3">
            <TextInput label="Section Label" value={config.kickerText} onChange={v => update("kickerText", v)} />
            <TextInput label="Headline" value={config.headline} onChange={v => update("headline", v)} />
            <TextAreaInput label="Sub-headline" value={config.subheadline} onChange={v => update("subheadline", v)} />
          </div>
        )}
      </div>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="WhatsApp Button" expanded={sections.button} onToggle={() => toggle("button")} />
        {sections.button && (
          <div className="p-4 space-y-3">
            <TextInput label="Button Text" value={config.buttonText} onChange={v => update("buttonText", v)} placeholder="Order on WhatsApp" />
            <TextInput label="WhatsApp Number" value={config.whatsappNumber} onChange={v => update("whatsappNumber", v)} placeholder="+1234567890" />
            <TextAreaInput label="Pre-filled Message" value={config.whatsappMessage} onChange={v => update("whatsappMessage", v)} hint="Message user sees when WhatsApp opens" />
          </div>
        )}
      </div>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Trust Badges" expanded={sections.badges} onToggle={() => toggle("badges")} />
        {sections.badges && (
          <div className="p-4">
            <BadgeListEditor
              badges={config.badges ?? []}
              onChange={v => update("badges", v)}
            />
          </div>
        )}
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FooterSettings({ config, update }: { config: Record<string, any>; update: (k: string, v: unknown) => void }) {
  return (
    <div className="p-4 space-y-3">
      <TextInput label="Brand Name" value={config.brandName} onChange={v => update("brandName", v)} />
      <TextInput label="Tagline" value={config.tagline} onChange={v => update("tagline", v)} />
      <TextInput label="WhatsApp Number" value={config.whatsappNumber} onChange={v => update("whatsappNumber", v)} />
      <TextInput label="Copyright Text" value={config.copyrightText} onChange={v => update("copyrightText", v)} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TestimonialsSettings({ config, update }: { config: Record<string, any>; update: (k: string, v: unknown) => void }) {
  const [sections, setSections] = useState({ copy: true, reviews: true });
  const toggle = (k: keyof typeof sections) => setSections(s => ({ ...s, [k]: !s[k] }));

  return (
    <>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Section Copy" expanded={sections.copy} onToggle={() => toggle("copy")} />
        {sections.copy && (
          <div className="p-4 space-y-3">
            <TextInput label="Section Label" value={config.kickerText} onChange={v => update("kickerText", v)} />
            <TextInput label="Title" value={config.title} onChange={v => update("title", v)} />
          </div>
        )}
      </div>
      <div className="border-b border-[#1f1f22]">
        <SectionHeader title="Reviews" expanded={sections.reviews} onToggle={() => toggle("reviews")} />
        {sections.reviews && (
          <div className="p-4">
            <ReviewListEditor
              reviews={config.reviews ?? []}
              onChange={v => update("reviews", v)}
            />
          </div>
        )}
      </div>
    </>
  );
}

// ─── Generic fallback for unrecognised block types ────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GenericSettings({ config, update }: { config: Record<string, any>; update: (k: string, v: unknown) => void }) {
  return (
    <div className="p-4 space-y-3">
      {Object.entries(config).map(([key, value]) => {
        if (typeof value === "string") {
          if (value.length > 80) {
            return <TextAreaInput key={key} label={key} value={value} onChange={v => update(key, v)} />;
          }
          return <TextInput key={key} label={key} value={value} onChange={v => update(key, v)} />;
        }
        return null;
      })}
    </div>
  );
}

// ─── Main BuilderSettings component ──────────────────────────────────────────

export default function BuilderSettings() {
  const { selectedBlockId, blocks, updateBlockConfig } = useBuilderStore();
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="w-[300px] border-r border-[#2a2a2c] bg-[#0a0a0b] hidden lg:flex flex-col shrink-0 z-10 items-center justify-center text-slate-500 text-sm p-8 text-center">
        <Settings2 size={32} className="mb-4 opacity-40" />
        <p className="font-medium text-slate-400 mb-1">No block selected</p>
        <p className="text-xs text-slate-600 mt-1">Click any section on the canvas to edit its content.</p>
      </div>
    );
  }

  // Single update function — directly calls store
  const update = (key: string, value: unknown) => {
    updateBlockConfig(selectedBlock.id, { [key]: value });
  };

  const blockTypeLabel: Record<string, string> = {
    hero: "Hero Section",
    features: "Features Grid",
    cta: "WhatsApp CTA",
    footer: "Footer",
    testimonials: "Testimonials",
  };

  return (
    <div className="w-[300px] border-r border-[#2a2a2c] bg-[#0a0a0b] hidden lg:flex flex-col shrink-0 z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2c] shrink-0">
        <h2 className="text-sm font-bold text-white">
          {blockTypeLabel[selectedBlock.type] ?? selectedBlock.type}
        </h2>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Changes update the preview instantly
        </p>
      </div>

      {/* Dynamic settings based on block type */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {selectedBlock.type === "hero" && (
          <HeroSettings config={selectedBlock.config} update={update} />
        )}
        {selectedBlock.type === "features" && (
          <FeaturesSettings config={selectedBlock.config} update={update} />
        )}
        {selectedBlock.type === "cta" && (
          <CTASettings config={selectedBlock.config} update={update} />
        )}
        {selectedBlock.type === "footer" && (
          <FooterSettings config={selectedBlock.config} update={update} />
        )}
        {selectedBlock.type === "testimonials" && (
          <TestimonialsSettings config={selectedBlock.config} update={update} />
        )}
        {!["hero", "features", "cta", "footer", "testimonials"].includes(selectedBlock.type) && (
          <GenericSettings config={selectedBlock.config} update={update} />
        )}
      </div>
    </div>
  );
}
