"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
  Layout,
  MessageSquare,
  Check,
  Star,
  Quote,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MousePointer2,
} from "lucide-react";

/* ── Animation Variants ── */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

/* ── Data ── */
const TEMPLATES = [
  {
    id: 1,
    title: "Le Petit Bistro",
    category: "Restaurant",
    image: "/restaurant_mockup.png",
    color: "#25D366"
  },
  {
    id: 2,
    title: "Vogue Atelier",
    category: "Fashion",
    image: "/fashion_mockup.png",
    color: "#8B5CF6"
  },
  {
    id: 3,
    title: "Lumina Spa",
    category: "Salon",
    image: "/salon_mockup.png",
    color: "#F59E0B"
  },
  {
    id: 4,
    title: "TechFlow Store",
    category: "Electronics",
    image: "/electronics_mockup.png",
    color: "#3B82F6"
  }
];

const FEATURES = [
  {
    title: "Premium Storefronts",
    desc: "Stunning, high-end designs that make your business look like a Fortune 500 company.",
    icon: Layout
  },
  {
    title: "WhatsApp Orders",
    desc: "Customers reach you directly on WhatsApp. No messy checkout, just direct sales.",
    icon: MessageSquare
  },
  {
    title: "AI Generated Copy",
    desc: "Our AI writes professional headlines and product descriptions for you in seconds.",
    icon: Sparkles
  },
  {
    title: "Launch in Minutes",
    desc: "Zero coding. Zero design skills. Just fill a form and go live instantly.",
    icon: Zap
  }
];

const METRICS = [
  { label: "Pages Created", value: "2,340+" },
  { label: "Orders Generated", value: "₹45L+" },
  { label: "Satisfaction", value: "98%" }
];

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Restaurant Owner",
    text: "PageDrop transformed how we take orders. Customers love the premium feel, and WhatsApp integration is seamless.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "David Chen",
    role: "Clothing Seller",
    text: "I was using plain WhatsApp catalogs before. PageDrop gave my brand the luxury look it deserved.",
    avatar: "https://i.pravatar.cc/150?u=david"
  },
  {
    name: "Elena Rossi",
    role: "Bakery Owner",
    text: "The AI copywriter is a lifesaver. My page was live in minutes and orders started coming in immediately.",
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

const STEPS = [
  { title: "Add products", desc: "List your items with photos and prices in our simple dashboard." },
  { title: "Customize design", desc: "Pick a premium theme that matches your brand's unique vibe." },
  { title: "Receive orders", desc: "Start sharing your link and get orders directly on WhatsApp." }
];

const PRICING = [
  {
    name: "FREE",
    price: "$0",
    desc: "Perfect for new creators",
    features: ["1 Page", "5 Products", "Basic Analytics"],
    cta: "Start Free",
    highlight: false
  },
  {
    name: "PRO",
    price: "$12",
    desc: "The professional choice",
    features: ["Unlimited Pages", "Unlimited Products", "Advanced Analytics", "Priority Support"],
    cta: "Go Pro Now",
    highlight: true
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    desc: "For growing teams",
    features: ["White Label", "Team Accounts", "Custom Domain", "Dedicated Support"],
    cta: "Contact Sales",
    highlight: false
  }
];

const COMPARISON = [
  { feature: "WhatsApp Native", pagedrop: true, shopify: false, wix: false, custom: false },
  { feature: "Fast Setup (<5 min)", pagedrop: true, shopify: false, wix: false, custom: false },
  { feature: "Free Start", pagedrop: true, shopify: true, wix: true, custom: false },
  { feature: "AI Copywriting", pagedrop: true, shopify: "Limited", wix: "Limited", custom: false },
  { feature: "Premium Templates", pagedrop: true, shopify: true, wix: true, custom: true },
  { feature: "No Coding Required", pagedrop: true, shopify: true, wix: true, custom: false }
];

const RESOURCES = [
  { title: "Grow Orders with WhatsApp", category: "Strategy", image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400" },
  { title: "Product Photography Tips", category: "Design", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400" },
  { title: "Why Businesses Choose Us", category: "Authority", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=400" }
];

function HomeContent() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((x - container.left) / container.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050508] text-gray-900 dark:text-white selection:bg-[#25D366]/30 font-sans transition-colors duration-500">
      <Navbar />
      <ThemeToggle />

      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center bg-white dark:bg-[#050508]">
        {/* Background blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] bg-[#25D366]/10 dark:bg-[#25D366]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-md mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[11px] font-space-grotesk font-semibold uppercase tracking-wider text-gray-800 dark:text-white/80">
                Trusted by 2,000+ growing businesses
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-heading font-medium leading-[1.1] mb-6 text-gray-900 dark:text-white">
              Turn Your Business into a <span className="italic text-[#25D366]">Premium</span> Sales Page
            </h1>
            
            <p className="text-lg text-gray-800 dark:text-white/80 font-sans leading-relaxed max-w-xl mb-10">
              No coding. No design skills. Just WhatsApp orders, premium visuals, and real results in under 5 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-[#25D366] text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                Try Free Now
                <ArrowRight size={18} />
              </Link>
              <a 
                href="#templates" 
                className="px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-gray-900 dark:text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              >
                See Templates
              </a>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-[#050508] overflow-hidden bg-gray-100 dark:bg-white/10">
                    <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-space-grotesk">
                <p className="font-bold text-gray-900 dark:text-white">2,000+ pages created</p>
                <p className="text-gray-700 dark:text-white/70">WhatsApp native & fast setup</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div 
              className="aspect-[4/5] sm:aspect-square relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl group shadow-2xl cursor-ew-resize"
              onMouseMove={handleMouseMove}
              onTouchMove={handleMouseMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* After (Bottom Layer) */}
              <div className="absolute inset-0 flex flex-col p-4 sm:p-8">
                <div className="w-full h-full relative">
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-[#25D366] text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">After PageDrop</div>
                  <Image 
                    src="/restaurant_mockup.png" 
                    alt="Premium PageDrop" 
                    fill 
                    priority
                    className="object-cover rounded-2xl"
                  />
                </div>
              </div>

              {/* Before Overlay (Top Layer - Dynamic width) */}
              <div 
                className="absolute inset-y-0 left-0 z-10 flex flex-col transition-all duration-100 pointer-events-none overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="h-full w-full bg-gray-200/90 dark:bg-[#050508]/80 backdrop-blur-md flex flex-col items-center justify-center border-r-2 border-[#25D366] p-8">
                   <div className="mb-4 text-xs font-space-grotesk font-bold uppercase tracking-widest text-gray-700 dark:text-white/80">Before</div>
                   <div className="w-[300px] sm:w-[400px] aspect-square relative opacity-50 grayscale shrink-0">
                      <Image 
                        src="/messy_whatsapp.png" 
                        alt="Messy WhatsApp" 
                        fill 
                        className="object-cover rounded-xl"
                      />
                   </div>
                </div>
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 z-20 w-[2px] bg-[#25D366] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white dark:bg-[#25D366] flex items-center justify-center shadow-2xl border-2 border-[#25D366]">
                  <div className="flex gap-0.5 text-black">
                    <ChevronLeft size={16} />
                    <ChevronRightIcon size={16} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — LIVE PRODUCT SHOWCASE
      ═══════════════════════════════════════════════ */}
      <section id="templates" className="py-24 px-6 bg-slate-50 dark:bg-[#08080C] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-heading mb-6 text-gray-900 dark:text-white">Designed for Every Industry</h2>
            <p className="text-gray-800 dark:text-white/70 max-w-2xl mx-auto font-sans">Luxury aesthetics met with high-conversion functionality. Choose a template that speaks your brand's language.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[450px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12121A] backdrop-blur-sm cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 dark:from-[#050508] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-[10px] font-space-grotesk font-bold uppercase tracking-widest text-[#25D366] mb-2 block">{item.category}</span>
                  <h3 className="text-2xl font-heading mb-4 text-white">{item.title}</h3>
                  <button className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70 group-hover:text-[#25D366] transition-colors">
                    Preview Template <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-semibold text-gray-900 dark:text-white">
              See More Templates <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — WHY PAGE DROP
      ═══════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#050508] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-24">
            {FEATURES.map((item, idx) => (
              <motion.div 
                key={idx}
                {...fadeUp}
                className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12121A] backdrop-blur-xl hover:border-[#25D366]/20 transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="h-12 w-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center mb-6 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-black transition-all">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-heading mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-800 dark:text-white/70 leading-relaxed font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-heading mb-6 text-gray-900 dark:text-white">Launch in Record Time</h2>
              <p className="text-gray-800 dark:text-white/70 font-sans">From product photography to your first order in three simple steps.</p>
            </motion.div>

            <div className="relative">
               {/* Timeline line */}
               <div className="absolute left-[24px] top-0 bottom-0 w-px bg-gradient-to-b from-[#25D366] via-[#25D366]/20 to-transparent hidden sm:block" />
               
               <div className="space-y-12">
                 {STEPS.map((step, idx) => (
                   <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      viewport={{ once: true }}
                      className="flex gap-8 relative z-10"
                   >
                     <div className="h-12 w-12 rounded-full bg-white dark:bg-[#050508] border-2 border-[#25D366] flex items-center justify-center shrink-0 font-space-grotesk font-bold text-[#25D366] shadow-md shadow-[#25D366]/10">
                       {idx + 1}
                     </div>
                     <div className="pt-2">
                       <h4 className="text-2xl font-heading mb-2 text-gray-900 dark:text-white">{step.title}</h4>
                       <p className="text-gray-800 dark:text-white/70 leading-relaxed font-sans">{step.desc}</p>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — SOCIAL PROOF
      ═══════════════════════════════════════════════ */}
      <section id="reviews" className="py-24 px-6 border-y border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#08080C] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {METRICS.map((m, idx) => (
              <motion.div key={idx} {...fadeUp} className="text-center">
                <div className="text-4xl lg:text-6xl font-heading text-[#25D366] mb-2">{m.value}</div>
                <div className="text-sm font-space-grotesk uppercase tracking-widest text-gray-600 dark:text-white/70">{m.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div 
                key={idx} 
                {...fadeUp} 
                className="p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-slate-200 dark:border-white/10 relative shadow-md hover:shadow-2xl transition-all"
              >
                <Quote className="absolute top-8 right-8 text-gray-200 dark:text-white/10" size={40} />
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-[#25D366] text-[#25D366]" />)}
                </div>
                <p className="text-lg font-sans italic text-gray-700 dark:text-white/80 mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 dark:border-white/10">
                    <img src={t.avatar} alt={t.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-white/70 uppercase tracking-widest font-space-grotesk">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════
          SECTION 6 — PRICING
      ═══════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 dark:bg-[#08080C] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-heading mb-6 text-gray-900 dark:text-white">Simple, Honest Pricing</h2>
            <p className="text-gray-800 dark:text-white/70 font-sans">Start small, grow big. No hidden fees, ever.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRICING.map((plan, idx) => (
              <motion.div 
                key={idx}
                {...fadeUp}
                className={`p-8 rounded-[40px] border relative transition-all duration-500 ${
                  plan.highlight 
                    ? 'bg-white dark:bg-[#25D366]/5 border-[#25D366]/40 shadow-2xl shadow-[#25D366]/10 scale-105 z-10' 
                    : 'bg-white dark:bg-[#12121A] border-slate-200 dark:border-white/10 shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#25D366] text-black text-[10px] font-bold rounded-full uppercase tracking-widest">Most Popular</div>
                )}
                <div className="text-sm font-space-grotesk font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-[#25D366] mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-heading text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-700 dark:text-white/60 text-sm">/mo</span>}
                </div>
                <p className="text-sm text-gray-800 dark:text-white/70 mb-8 font-sans">{plan.desc}</p>
                
                <ul className="space-y-4 mb-10">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/80 font-sans">
                      <div className="h-5 w-5 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                        <Check size={12} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-[#25D366] text-black hover:bg-[#20ba59] shadow-lg shadow-[#25D366]/20' 
                    : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — COMPETITOR COMPARISON
      ═══════════════════════════════════════════════ */}
      <section className="py-24 px-6 overflow-x-auto bg-white dark:bg-[#050508] transition-colors duration-500">
        <div className="max-w-5xl mx-auto min-w-[800px]">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-heading mb-6 text-gray-900 dark:text-white">Why PageDrop?</h2>
          </motion.div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="py-6 px-4 text-gray-700 dark:text-white/60 font-space-grotesk uppercase text-xs tracking-widest">Feature</th>
                <th className="py-6 px-4 bg-[#25D366]/5 text-[#25D366] font-heading text-2xl font-bold">PageDrop</th>
                <th className="py-6 px-4 text-gray-900 dark:text-white font-sans text-base font-bold">Shopify</th>
                <th className="py-6 px-4 text-gray-900 dark:text-white font-sans text-base font-bold">Wix</th>
                <th className="py-6 px-4 text-gray-900 dark:text-white font-sans text-base font-bold">Custom Site</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-200 dark:border-white/5">
                  <td className="py-6 px-4 text-sm font-medium text-gray-900 dark:text-white font-sans">{row.feature}</td>
                  <td className="py-6 px-4 bg-[#25D366]/5">
                    {row.pagedrop === true ? <Check className="text-[#25D366] stroke-[3]" size={20} /> : <span className="font-bold text-[#25D366]">{row.pagedrop}</span>}
                  </td>
                  <td className="py-6 px-4 text-gray-500 dark:text-white/80">
                    {row.shopify === true ? <Check className="text-gray-900 dark:text-white/90" size={20} /> : <span className="text-sm font-medium">{row.shopify || '—'}</span>}
                  </td>
                  <td className="py-6 px-4 text-gray-500 dark:text-white/80">
                    {row.wix === true ? <Check className="text-gray-900 dark:text-white/90" size={20} /> : <span className="text-sm font-medium">{row.wix || '—'}</span>}
                  </td>
                  <td className="py-6 px-4 text-gray-500 dark:text-white/80">
                    {row.custom === true ? <Check className="text-gray-900 dark:text-white/90" size={20} /> : <span className="text-sm font-medium">{row.custom || '—'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8 — RESOURCE / AUTHORITY
      ═══════════════════════════════════════════════ */}
      <section id="resources" className="py-24 px-6 bg-slate-50 dark:bg-[#08080C] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-heading mb-6 text-gray-900 dark:text-white">Expert Insights</h2>
            <p className="text-gray-800 dark:text-white/70 font-sans font-sans">Level up your sales game with our curated resources.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {RESOURCES.map((r, idx) => (
              <motion.div 
                key={idx}
                {...fadeUp}
                className="group cursor-pointer bg-white dark:bg-[#12121A] rounded-3xl border border-slate-200 dark:border-white/10 shadow-md hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="aspect-[16/10] relative overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <Image src={r.image} alt={r.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white">{r.category}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-heading mb-3 text-gray-900 dark:text-white group-hover:text-[#25D366] transition-colors">{r.title}</h3>
                  <button className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-[#25D366] flex items-center gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Read Article <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-semibold text-gray-900 dark:text-white">
              Read More Resources
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 9 — FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white dark:bg-[#050508] transition-colors duration-500">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[60px] p-12 lg:p-24 overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none bg-white dark:bg-transparent"
          >
            {/* Mesh gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/20 via-transparent to-[#8B5CF6]/10 z-0 opacity-50 dark:opacity-100" />
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#25D366] blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 text-center">
               <h2 className="text-4xl lg:text-7xl font-heading mb-8 text-gray-900 dark:text-white">Ready to Grow with <span className="italic">PageDrop?</span></h2>
               <p className="text-lg text-gray-800 dark:text-white/60 mb-12 max-w-xl mx-auto font-sans">Launch your premium sales page today and start receiving orders instantly.</p>
               
               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <Link 
                    href="/signup" 
                    className="px-10 py-5 bg-[#25D366] text-black font-bold rounded-2xl text-lg hover:bg-[#20ba59] transition-all transform hover:scale-[1.05] shadow-lg shadow-[#25D366]/20"
                 >
                    Start Free Now
                 </Link>
                 <button className="px-10 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-gray-900 dark:text-white font-bold rounded-2xl text-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                    Book a Demo
                 </button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Sticky Mobile Header CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
         <Link 
            href="/signup" 
            className="w-full h-14 bg-[#25D366] text-black font-bold rounded-2xl flex items-center justify-center shadow-2xl shadow-[#25D366]/40"
         >
            Start Free Now
         </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeContent />
  );
}
