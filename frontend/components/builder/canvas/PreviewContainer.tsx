import React, { ReactNode } from "react";
import { useBuilderStore } from "@/lib/builder/store";

interface PreviewContainerProps {
    children: ReactNode;
}

export default function PreviewContainer({ children }: PreviewContainerProps) {
    const { deviceMode } = useBuilderStore();

    const isMobile = deviceMode === "mobile";

    return (
        <div className={`relative mx-auto transition-all duration-300 ease-in-out origin-top flex flex-col ${
            isMobile 
                ? "w-[375px] min-h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-[#1a1a1c] my-8" 
                : "w-full h-full max-w-[1200px] rounded-xl border border-[#2a2a2c] bg-[#111112] shadow-2xl overflow-hidden"
        }`}>
            {/* Mobile Notch Simulation */}
            {isMobile && (
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                    <div className="w-32 h-6 bg-[#1a1a1c] rounded-b-xl"></div>
                </div>
            )}
            
            {/* Desktop MacBook Window Header */}
            {!isMobile && (
                <div className="h-10 border-b border-[#1f1f22] bg-[#1a1a1c] flex items-center px-4 shrink-0 relative">
                    {/* Traffic Lights */}
                    <div className="flex gap-1.5 z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    {/* Address Bar */}
                    <div className="absolute inset-x-0 flex justify-center pointer-events-none">
                        <div className="h-6 w-1/3 min-w-[200px] max-w-[400px] bg-[#111112] rounded-md border border-[#2a2a2c] flex items-center justify-center">
                            <span className="text-[10px] text-slate-500 font-mono tracking-wide truncate px-4">myshop.com/spring-collection</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className={`w-full flex-1 relative ${isMobile ? 'overflow-y-auto custom-scrollbar' : 'overflow-y-auto custom-scrollbar bg-white'}`}>
                {children}
            </div>
        </div>
    );
}
