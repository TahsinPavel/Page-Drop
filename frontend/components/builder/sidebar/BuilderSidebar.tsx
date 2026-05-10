import React, { useState } from "react";
import { LayoutTemplate, Layers, Plus, ChevronUp, ChevronDown, Trash2, Lock } from "lucide-react";
import { registry } from "@/lib/builder/registry";
import { useBuilderStore } from "@/lib/builder/store";
import toast from "react-hot-toast";

export default function BuilderSidebar() {
    const [activeTab, setActiveTab] = useState<"add" | "layers">("add");
    const {
        addBlock,
        blocks,
        selectedBlockId,
        setSelectedBlock,
        removeBlock,
        reorderBlocks,
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
                                            const isLocked = block.isPremium && userPlan === "free";
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
            </div>
        </div>
    );
}
