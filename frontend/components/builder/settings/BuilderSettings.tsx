import React from "react";
import { useBuilderStore } from "@/lib/builder/store";
import { Settings2, MoreVertical, Edit3, Image as ImageIcon, SlidersHorizontal, UploadCloud, Trash2, Check } from "lucide-react";

export default function BuilderSettings() {
    const { selectedBlockId, blocks } = useBuilderStore();

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    if (!selectedBlock) {
        return (
            <div className="w-[325px] border-r border-[#2a2a2c] bg-[#0a0a0b] hidden lg:flex flex-col shrink-0 z-10 items-center justify-center text-slate-500 text-sm p-8 text-center">
                <Settings2 size={32} className="mb-4 opacity-50" />
                <p>Select a block on the canvas to edit its properties.</p>
            </div>
        );
    }

    return (
        <div className="w-[325px] border-r border-[#2a2a2c] bg-[#0a0a0b] hidden lg:flex flex-col shrink-0 z-10">
            {/* Header */}
            <div className="p-5 border-b border-[#1f1f22] flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-white tracking-tight">3D Carousel Hero</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Hero Section Configuration</p>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                {/* Style Variant */}
                <div className="p-5 border-b border-[#1f1f22]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Style Variant</span>
                        <button className="text-[10px] px-2 py-1 bg-[#1a1a1c] text-slate-300 rounded hover:bg-[#2a2a2c] transition-colors">
                            Live Prev
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Demo 7 - Selected */}
                        <div className="border border-indigo-500/50 bg-indigo-500/5 rounded-xl p-3 flex gap-3 cursor-pointer transition-all hover:border-indigo-500/70">
                            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                                <div className="flex gap-0.5">
                                    <div className="w-4 h-6 bg-indigo-500 rounded-sm rounded-r-none" />
                                    <div className="w-4 h-6 bg-pink-500 rounded-sm rounded-l-none" />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-xs font-bold text-white leading-tight mb-1">Deep Carousel (Demo 7)</h3>
                                <div className="self-start px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold tracking-wider uppercase rounded mb-1.5">
                                    Best for conversions
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    Smooth circular rotation with 3 main product focuses.
                                </p>
                            </div>
                        </div>

                        {/* Demo 8 */}
                        <div className="border border-[#2a2a2c] bg-[#111112] rounded-xl p-3 flex gap-3 cursor-pointer transition-all hover:border-[#3a3a3c]">
                            <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                                <div className="w-6 h-6 bg-indigo-500 rounded-full" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-xs font-bold text-white leading-tight mb-1">Floating Orbit (Demo 8)</h3>
                                <div className="self-start px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-bold tracking-wider uppercase rounded mb-1.5">
                                    Luxury feel
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    Floating elements with dynamic lighting and parallax.
                                </p>
                            </div>
                        </div>

                        {/* Demo 9 */}
                        <div className="border border-[#2a2a2c] bg-[#111112] rounded-xl p-3 flex gap-3 cursor-pointer transition-all hover:border-[#3a3a3c]">
                            <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                                <div className="w-6 h-8 bg-slate-800 rounded-sm -rotate-12 border border-slate-700" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-xs font-bold text-white leading-tight mb-1">Explosion View (Demo 9)</h3>
                                <div className="self-start px-1.5 py-0.5 bg-orange-500/10 text-orange-400 text-[8px] font-bold tracking-wider uppercase rounded mb-1.5">
                                    Story driven
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    Deconstruct your product to show every detail.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography & Copy */}
                <div className="p-5 border-b border-[#1f1f22]">
                    <div className="flex items-center gap-2 mb-4">
                        <Edit3 size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Typography & Copy</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] text-slate-400 mb-1.5">Primary Headline</label>
                            <input
                                type="text"
                                defaultValue="Experience sound in a new dimension."
                                className="w-full bg-[#111112] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-slate-400 mb-1.5">Description Text</label>
                            <textarea
                                defaultValue="The all-new Aura Pro combines spatial audio with an ultra-lightweight design. Perfect for creators, audiophiles, and everyday listeners."
                                className="w-full bg-[#111112] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[80px] resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] text-slate-400 mb-1.5">Price Display</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                    <input
                                        type="text"
                                        defaultValue="299"
                                        className="w-full bg-[#111112] border border-[#2a2a2c] rounded-md pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] text-slate-400 mb-1.5">Button Text</label>
                                <input
                                    type="text"
                                    defaultValue="Pre-order Now"
                                    className="w-full bg-[#111112] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D Assets */}
                <div className="p-5 border-b border-[#1f1f22]">
                    <div className="flex items-center gap-2 mb-4">
                        <ImageIcon size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">3D Assets</span>
                    </div>

                    <div className="border border-dashed border-[#2a2a2c] rounded-xl bg-[#111112] p-5 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1c] flex items-center justify-center mb-3">
                            <UploadCloud size={18} className="text-slate-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">Upload GLTF/GLB or Image</h4>
                        <p className="text-[10px] text-slate-500 mb-4">Supported files: .glb, .png, .jpg (Max 20MB)</p>

                        <div className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="bg-indigo-500/20 text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                                    3D
                                </div>
                                <span className="text-xs text-slate-300 truncate">headphone_aura.glb</span>
                            </div>
                            <button className="text-slate-500 hover:text-red-400 transition-colors shrink-0 ml-2">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Display Settings</span>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-semibold text-white mb-0.5">Show Trust Badge</h4>
                                <p className="text-[10px] text-slate-500">Displays "Top Rated" pill above headline</p>
                            </div>
                            <div className="w-9 h-5 bg-indigo-500 rounded-full flex items-center px-0.5 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-semibold text-white mb-0.5">Show Star Rating</h4>
                                <p className="text-[10px] text-slate-500">Displays review stars under description</p>
                            </div>
                            <div className="w-9 h-5 bg-indigo-500 rounded-full flex items-center px-0.5 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-semibold text-white mb-0.5">Auto-rotate 3D Model</h4>
                                <p className="text-[10px] text-slate-500">Spins asset continuously on page load</p>
                            </div>
                            <div className="w-9 h-5 bg-indigo-500 rounded-full flex items-center px-0.5 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
