import React, { useState } from "react";
import { LayoutTemplate, Layers, Settings, Plus, ChevronUp, ChevronDown, Trash2, Lock } from "lucide-react";
import { registry } from "@/lib/builder/registry";
import { useBuilderStore } from "@/lib/builder/store";
import toast from "react-hot-toast";

export default function BuilderSidebar() {
    const [activeTab, setActiveTab] = useState<"add" | "layers" | "global">("add");
    const {
        addBlock,
        blocks,
        selectedBlockId,
        setSelectedBlock,
        removeBlock,
        reorderBlocks,
        pageDetails,
        updatePageDetails,
        globalSettings,
        updateGlobalSettings,
        userPlan,
    } = useBuilderStore();

    // Available blocks grouped by category
    const categories = registry.getBlocksByCategory();

    return (
        <div className="w-72 border-r border-[#2a2a2c] bg-[#111112] flex flex-col shrink-0 z-10">
            {/* Tabs */}
            <div className="flex border-b border-[#2a2a2c]">
                <button
                    onClick={() => setActiveTab("add")}
                    className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "add" ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                    <Plus size={14} /> Add Block
                </button>
                <button
                    onClick={() => setActiveTab("layers")}
                    className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "layers" ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                    <Layers size={14} /> Layers
                    {blocks.length > 0 && (
                        <span className="bg-[#2a2a2c] text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {blocks.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("global")}
                    className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "global" ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}
                >
                    <Settings size={14} /> Page Info
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {/* ── ADD BLOCK TAB ── */}
                {activeTab === "add" && (
                    <div className="space-y-6">
                        {Object.keys(categories).length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                No blocks registered yet.
                            </div>
                        ) : (
                            Object.entries(categories).map(([cat, catBlocks]) => (
                                <div key={cat}>
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{cat}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {catBlocks.map((block) => {
                                            const isLocked = block.isPremium && userPlan === "free"; // Phase 4D gating
                                            return (
                                                <button
                                                    key={block.type}
                                                    onClick={() => {
                                                        if (isLocked) {
                                                            toast("Upgrade to Pro to unlock this block.", { icon: "🔒", duration: 3000 });
                                                            return;
                                                        }
                                                        const defaultVariant = block.variants[0].id;
                                                        addBlock(block.type, defaultVariant, block.defaultConfig);
                                                    }}
                                                    className={`aspect-video bg-[#1a1a1c] border border-[#2a2a2c] rounded-lg hover:border-indigo-500 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-400 transition-all group relative ${isLocked ? "opacity-60" : ""}`}
                                                >
                                                    {isLocked && (
                                                        <div className="absolute top-1.5 right-1.5">
                                                            <Lock size={10} className="text-amber-500" />
                                                        </div>
                                                    )}
                                                    <LayoutTemplate size={20} className="group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] text-center font-medium px-1">{block.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── LAYERS TAB ── */}
                {activeTab === "layers" && (
                    <div className="space-y-1">
                        {blocks.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                <Layers size={24} className="mx-auto mb-3 opacity-40" />
                                <p>No blocks on the page yet.</p>
                                <p className="text-xs mt-1">Add blocks from the &ldquo;Add Block&rdquo; tab.</p>
                            </div>
                        ) : (
                            blocks.map((block, idx) => {
                                const blockDef = registry.getBlock(block.type);
                                const isSelected = selectedBlockId === block.id;

                                return (
                                    <div
                                        key={block.id}
                                        onClick={() => setSelectedBlock(block.id)}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${
                                            isSelected
                                                ? "bg-indigo-500/15 border border-indigo-500/40 text-white"
                                                : "bg-[#1a1a1c] border border-transparent hover:border-[#2a2a2c] text-slate-400 hover:text-slate-200"
                                        }`}
                                    >
                                        {/* Block Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold truncate">
                                                {blockDef?.name || block.type}
                                            </div>
                                            <div className="text-[10px] text-slate-500 truncate">
                                                {block.variant}
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (idx > 0) reorderBlocks(idx, idx - 1);
                                                }}
                                                disabled={idx === 0}
                                                className="p-1 rounded hover:bg-[#2a2a2c] disabled:opacity-20 transition-colors"
                                                title="Move Up"
                                            >
                                                <ChevronUp size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (idx < blocks.length - 1) reorderBlocks(idx, idx + 1);
                                                }}
                                                disabled={idx === blocks.length - 1}
                                                className="p-1 rounded hover:bg-[#2a2a2c] disabled:opacity-20 transition-colors"
                                                title="Move Down"
                                            >
                                                <ChevronDown size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeBlock(block.id);
                                                }}
                                                className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ── PAGE INFO TAB ── */}
                {activeTab === "global" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Business Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={pageDetails.businessName}
                                onChange={(e) => updatePageDetails({ businessName: e.target.value })}
                                className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="e.g. My Awesome Store"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Page Slug (URL)</label>
                            <input
                                type="text"
                                value={pageDetails.slug}
                                onChange={(e) => updatePageDetails({ slug: e.target.value })}
                                className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="auto-generated-from-name"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Leave blank to auto-generate from business name.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                WhatsApp Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={pageDetails.whatsappNumber}
                                onChange={(e) => updatePageDetails({ whatsappNumber: e.target.value })}
                                className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="+1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={pageDetails.category}
                                onChange={(e) => updatePageDetails({ category: e.target.value })}
                                className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="Ecommerce">Ecommerce</option>
                                <option value="Services">Services</option>
                                <option value="Portfolio">Portfolio</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="pt-4 border-t border-[#2a2a2c]">
                            <p className="text-xs text-slate-500 mb-4">
                                Fields marked with <span className="text-red-400">*</span> are required before publishing.
                            </p>
                            
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Global Theme Settings</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Theme</label>
                                    <select
                                        value={globalSettings.theme}
                                        onChange={(e) => updateGlobalSettings({ theme: e.target.value as "light" | "dark" })}
                                        className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="dark">Dark</option>
                                        <option value="light">Light</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Primary Color (Hex)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={globalSettings.primaryColor}
                                            onChange={(e) => updateGlobalSettings({ primaryColor: e.target.value })}
                                            className="w-10 h-10 rounded border border-[#2a2a2c] bg-transparent cursor-pointer p-0"
                                        />
                                        <input
                                            type="text"
                                            value={globalSettings.primaryColor}
                                            onChange={(e) => updateGlobalSettings({ primaryColor: e.target.value })}
                                            className="flex-1 bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Font Family</label>
                                    <select
                                        value={globalSettings.fontFamily}
                                        onChange={(e) => updateGlobalSettings({ fontFamily: e.target.value })}
                                        className="w-full bg-[#1a1a1c] border border-[#2a2a2c] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="inter">Inter</option>
                                        <option value="roboto">Roboto</option>
                                        <option value="outfit">Outfit</option>
                                        <option value="playfair">Playfair Display</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
