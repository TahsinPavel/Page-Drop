import React from "react";
import PreviewContainer from "./PreviewContainer";
import { useBuilderStore } from "@/lib/builder/store";
import { registry } from "@/lib/builder/registry";

export default function BuilderCanvas() {
    const { blocks, selectedBlockId, setSelectedBlock } = useBuilderStore();

    return (
        <div className="flex-1 bg-[#0a0a0b] overflow-y-auto relative p-4 lg:p-8 flex items-start justify-center custom-scrollbar">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] pointer-events-none" />
            
            <PreviewContainer>
                {blocks.length === 0 ? (
                    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Your canvas is empty</p>
                        <p className="text-xs text-slate-500 mt-1">Add a block from the sidebar to get started</p>
                    </div>
                ) : (
                    <div className="w-full min-h-full flex flex-col bg-white">
                        {blocks.map((block) => {
                            const blockDef = registry.getBlock(block.type);
                            const isSelected = selectedBlockId === block.id;
                            
                            return (
                                <div 
                                    key={block.id}
                                    onClick={() => setSelectedBlock(block.id)}
                                    className={`relative group cursor-pointer transition-all ${isSelected ? 'ring-2 ring-indigo-500 z-10' : 'hover:ring-2 hover:ring-indigo-500/50 hover:z-10'}`}
                                >
                                    {/* Selection/Hover Overlay Controls */}
                                    <div className={`absolute top-0 left-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br z-20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                        {blockDef ? blockDef.name : block.type}
                                    </div>
                                    
                                    {/* Render the actual component dynamically */}
                                    {blockDef ? (() => {
                                        const variantDef = blockDef.variants.find(v => v.id === block.variant) || blockDef.variants[0];
                                        if (variantDef && variantDef.Component) {
                                            const Component = variantDef.Component;
                                            return (
                                                <Component 
                                                    config={block.config} 
                                                    variant={block.variant} 
                                                    isPreview={false}
                                                />
                                            );
                                        }
                                        return <div className="p-8 border-2 border-dashed border-red-300 bg-red-50 text-red-500 text-center">Missing component for variant</div>;
                                    })() : (
                                        <div className="p-8 border-2 border-dashed border-red-300 bg-red-50 text-red-500 text-center">
                                            Unknown block type: {block.type}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </PreviewContainer>
        </div>
    );
}
