"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyPages,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    regenerateAI,
} from "@/lib/api";
import type { CreatePageInput, UpdatePageInput } from "@/types";

export function useMyPages() {
    return useQuery({
        queryKey: ["my-pages"],
        queryFn: getMyPages,
    });
}

export function usePageById(id: string) {
    return useQuery({
        queryKey: ["page", id],
        queryFn: () => getPageById(id),
        enabled: !!id,
    });
}

export function useCreatePage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreatePageInput) => createPage(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-pages"] }),
    });
}

export function useUpdatePage(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: UpdatePageInput) => updatePage(id, input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-pages"] });
            qc.invalidateQueries({ queryKey: ["page", id] });
        },
    });
}

export function useDeletePage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePage(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["my-pages"] }),
    });
}

export function useRegenerateAI(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => regenerateAI(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["page", id] }),
    });
}
