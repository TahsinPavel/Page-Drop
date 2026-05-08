import React, { useEffect, useState } from "react";
import BuilderTopbar from "./BuilderTopbar";
import BuilderSidebar from "../sidebar/BuilderSidebar";
import BuilderSettings from "../settings/BuilderSettings";
import BuilderCanvas from "../canvas/BuilderCanvas";
import { useBuilderStore } from "@/lib/builder/store";
import { MonitorX, Loader2 } from "lucide-react";

export default function BuilderLayout({ pageId }: { pageId: string }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(pageId !== "new");
    const { loadState } = useBuilderStore();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (pageId === "new") {
            setIsLoading(false);
            return;
        }

        const fetchPage = async () => {
            try {
                const { getPageById } = await import("@/lib/api");
                const page = await getPageById(pageId);

                let blocks: import("@/lib/builder/types").BlockInstance[] = [];
                let globalSettings: import("@/lib/builder/types").GlobalSettings = {
                    primaryColor: "#111111",
                    fontFamily: "inter",
                    theme: "dark",
                    language: "en",
                };

                if (page.layout_config) {
                    const lc = page.layout_config as Record<string, unknown>;
                    if (Array.isArray(lc.blocks)) blocks = lc.blocks as import("@/lib/builder/types").BlockInstance[];
                    if (lc.globalSettings) globalSettings = lc.globalSettings as import("@/lib/builder/types").GlobalSettings;
                }

                loadState(blocks, globalSettings, {
                    businessName: page.business_name || "",
                    slug: page.slug || "",
                    category: page.category || "Other",
                    whatsappNumber: page.whatsapp_number || "",
                });
            } catch (error) {
                console.error("Failed to load page:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPage();
    }, [pageId, loadState]);

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center h-[100dvh] w-full bg-[#0a0a0b] text-slate-400 p-8 text-center">
                <MonitorX size={48} className="mb-4 opacity-50" />
                <h2 className="text-lg font-semibold text-white mb-2">Desktop Required</h2>
                <p className="text-sm">This page is only supported on the desktop version of PageDrop. Please open this page on a larger screen to build your landing page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#0a0a0b] text-white overflow-hidden">
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                    <p className="text-sm text-slate-400">Loading page…</p>
                </div>
            ) : (
                <>
                    <BuilderTopbar pageId={pageId} />
                    <div className="flex flex-1 overflow-hidden">
                        <BuilderSidebar />
                        <BuilderSettings />
                        <BuilderCanvas />
                    </div>
                </>
            )}
        </div>
    );
}
