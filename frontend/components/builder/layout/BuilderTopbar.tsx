import React, { useState } from "react";
import { useBuilderStore } from "@/lib/builder/store";
import { Monitor, Smartphone, Undo2, Redo2, Eye, Save, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/lib/api";
import toast from "react-hot-toast";

export default function BuilderTopbar({ pageId }: { pageId: string }) {
    const { deviceMode, setDeviceMode, undo, redo, past, future, blocks, globalSettings, pageDetails } = useBuilderStore();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const validateFields = (): boolean => {
        if (!pageDetails.businessName.trim()) {
            toast.error("Business Name is required. Fill it in the Page Info tab.", { duration: 4000 });
            return false;
        }
        if (!pageDetails.whatsappNumber.trim()) {
            toast.error("WhatsApp Number is required. Fill it in the Page Info tab.", { duration: 4000 });
            return false;
        }
        if (!pageDetails.category.trim()) {
            toast.error("Category is required. Fill it in the Page Info tab.", { duration: 4000 });
            return false;
        }
        if (blocks.length === 0) {
            toast.error("Add at least one block before saving.", { duration: 4000 });
            return false;
        }
        return true;
    };

    const handleSave = async (publish: boolean = false) => {
        if (!validateFields()) return;

        const layoutConfig = {
            blocks,
            globalSettings,
        };

        const pageData = {
            business_name: pageDetails.businessName.trim(),
            slug: pageDetails.slug || pageDetails.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            category: pageDetails.category,
            whatsapp_number: pageDetails.whatsappNumber.trim(),
            theme: globalSettings.theme,
            layout_config: layoutConfig,
            is_active: publish,
        };

        try {
            if (publish) setIsPublishing(true);
            else setIsSaving(true);

            if (pageId === "new") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newPage = await createPage(pageData as any);
                toast.success(publish ? "Page published! 🎉" : "Draft saved!", { duration: 3000 });
                router.replace(`/dashboard/build/${newPage.id}`);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await updatePage(pageId, pageData as any);
                toast.success(publish ? "Page published! 🎉" : "Draft saved!", { duration: 3000 });
            }

            setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Failed to save page. Please try again.");
        } finally {
            setIsSaving(false);
            setIsPublishing(false);
        }
    };

    return (
        <div className="h-14 border-b border-[#2a2a2c] bg-[#111112] flex items-center justify-between px-4 select-none shrink-0">
            {/* Left: Brand / Exit */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
                        <Monitor size={16} className="text-indigo-400" />
                    </div>
                    <span className="font-semibold tracking-tight text-sm">AeroBuilder</span>
                </Link>
                <div className="h-4 w-px bg-[#2a2a2c]" />
                <span className="text-xs text-slate-400">{pageDetails.businessName || "New Page"}</span>
                {lastSaved && (
                    <span className="text-[10px] text-emerald-500/70 flex items-center gap-1">
                        <Check size={10} /> Saved at {lastSaved}
                    </span>
                )}
            </div>

            {/* Center: Device Toggle & Undo/Redo */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#1a1a1c] rounded-md p-1 border border-[#2a2a2c]">
                    <button
                        onClick={() => setDeviceMode("mobile")}
                        className={`p-1.5 rounded ${deviceMode === "mobile" ? "bg-[#2a2a2c] text-white" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        <Smartphone size={16} />
                    </button>
                    <button
                        onClick={() => setDeviceMode("desktop")}
                        className={`p-1.5 rounded ${deviceMode === "desktop" ? "bg-[#2a2a2c] text-white" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        <Monitor size={16} />
                    </button>
                </div>

                <div className="w-4" />

                <div className="flex items-center bg-[#1a1a1c] rounded-md border border-[#2a2a2c] overflow-hidden">
                    <button
                        onClick={undo}
                        disabled={past.length === 0}
                        className="p-2 text-slate-400 hover:text-white hover:bg-[#2a2a2c] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={16} />
                    </button>
                    <div className="w-px h-full bg-[#2a2a2c]" />
                    <button
                        onClick={redo}
                        disabled={future.length === 0}
                        className="p-2 text-slate-400 hover:text-white hover:bg-[#2a2a2c] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo2 size={16} />
                    </button>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button className="text-slate-400 hover:text-white transition-colors" title="Preview">
                    <Eye size={18} />
                </button>
                <button
                    onClick={() => handleSave(false)}
                    disabled={isSaving || isPublishing}
                    className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-[#1a1a1c] border border-[#2a2a2c] rounded transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Draft
                </button>
                <button
                    onClick={() => handleSave(true)}
                    disabled={isSaving || isPublishing}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                    {isPublishing && <Loader2 size={14} className="animate-spin" />}
                    Publish
                </button>
            </div>
        </div>
    );
}
