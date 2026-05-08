import { create } from "zustand";
import { BlockInstance, GlobalSettings, PageDetails, LayoutConfig } from "./types";
import { v4 as uuidv4 } from "uuid";

interface BuilderState {
    // Current State
    blocks: BlockInstance[];
    globalSettings: GlobalSettings;
    pageDetails: PageDetails;
    selectedBlockId: string | null;
    deviceMode: "desktop" | "mobile";
    isPreviewMode: boolean;

    // History (Undo/Redo Stack)
    past: BlockInstance[][];
    future: BlockInstance[][];

    // User context
    userPlan: "free" | "pro" | "business";

    // Actions
    setDeviceMode: (mode: "desktop" | "mobile") => void;
    setIsPreviewMode: (is: boolean) => void;
    setSelectedBlock: (id: string | null) => void;
    updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
    updatePageDetails: (details: Partial<PageDetails>) => void;
    setUserPlan: (plan: "free" | "pro" | "business") => void;

    // Block Actions (These affect history)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addBlock: (type: string, variant: string, defaultConfig: Record<string, any>) => void;
    updateBlockConfig: (id: string, config: Record<string, unknown>) => void;
    updateBlockVariant: (id: string, newVariant: string) => void;
    removeBlock: (id: string) => void;
    reorderBlocks: (startIndex: number, endIndex: number) => void;

    // Load State
    loadState: (blocks: BlockInstance[], globalSettings: GlobalSettings, pageDetails: PageDetails) => void;

    // History Actions
    undo: () => void;
    redo: () => void;

    // Internal helper to save to history
    _commitHistory: (newBlocks: BlockInstance[]) => void;
}

const defaultGlobalSettings: GlobalSettings = {
    primaryColor: "#111111",
    fontFamily: "inter",
    theme: "dark",
    language: "en"
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
    blocks: [],
    globalSettings: defaultGlobalSettings,
    pageDetails: {
        businessName: "",
        slug: "",
        category: "Other",
        whatsappNumber: ""
    },
    userPlan: "free",
    selectedBlockId: null,
    deviceMode: "desktop",
    isPreviewMode: false,

    past: [],
    future: [],

    setDeviceMode: (mode) => set({ deviceMode: mode }),
    setIsPreviewMode: (is) => set({ isPreviewMode: is }),
    setSelectedBlock: (id) => set({ selectedBlockId: id }),
    setUserPlan: (plan) => set({ userPlan: plan }),
    
    updateGlobalSettings: (settings) => set((state) => ({
        globalSettings: { ...state.globalSettings, ...settings }
    })),

    updatePageDetails: (details) => set((state) => ({
        pageDetails: { ...state.pageDetails, ...details }
    })),

    _commitHistory: (newBlocks) => {
        set((state) => {
            // Keep maximum of 50 history states
            const newPast = [...state.past, state.blocks].slice(-50);
            return {
                past: newPast,
                blocks: newBlocks,
                future: [] // Clear future on new action
            };
        });
    },

    loadState: (blocks, globalSettings, pageDetails) => {
        set({
            blocks,
            globalSettings,
            pageDetails,
            past: [],
            future: [],
            selectedBlockId: null,
        });
    },

    addBlock: (type, variant, defaultConfig) => {
        const { blocks, _commitHistory, userPlan } = get();
        
        // We could import registry here but it's better to let the UI handle the actual toast.
        // As a safeguard in the store, if we had access to blockDef.isPremium, we'd check it.
        // For now, the UI strictly enforces it. We will leave this pure to keep things decoupled,
        // but if we needed strict store enforcement we could import registry.getBlock(type).
        
        const newBlock: BlockInstance = {
            id: `blk_${uuidv4()}`,
            type,
            variant,
            order: blocks.length,
            config: { ...defaultConfig }
        };
        const newBlocks = [...blocks, newBlock];
        _commitHistory(newBlocks);
        set({ selectedBlockId: newBlock.id });
    },

    updateBlockConfig: (id, newConfig) => {
        const { blocks, _commitHistory } = get();
        const newBlocks = blocks.map(b => 
            b.id === id ? { ...b, config: { ...b.config, ...newConfig } } : b
        );
        _commitHistory(newBlocks);
    },

    updateBlockVariant: (id, newVariant) => {
         const { blocks, _commitHistory } = get();
         const newBlocks = blocks.map(b => 
             b.id === id ? { ...b, variant: newVariant } : b
         );
         _commitHistory(newBlocks);
    },

    removeBlock: (id) => {
        const { blocks, _commitHistory, selectedBlockId } = get();
        const newBlocks = blocks.filter(b => b.id !== id);
        _commitHistory(newBlocks);
        if (selectedBlockId === id) {
            set({ selectedBlockId: null });
        }
    },

    reorderBlocks: (startIndex, endIndex) => {
        const { blocks, _commitHistory } = get();
        const result = Array.from(blocks);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        // Update order fields
        const ordered = result.map((b, i) => ({ ...b, order: i }));
        _commitHistory(ordered);
    },

    undo: () => {
        set((state) => {
            if (state.past.length === 0) return state;
            
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            
            return {
                past: newPast,
                blocks: previous,
                future: [state.blocks, ...state.future]
            };
        });
    },

    redo: () => {
        set((state) => {
            if (state.future.length === 0) return state;
            
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            
            return {
                past: [...state.past, state.blocks],
                blocks: next,
                future: newFuture
            };
        });
    }
}));
