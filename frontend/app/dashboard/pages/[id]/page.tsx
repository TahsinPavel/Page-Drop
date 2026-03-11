"use client";

import { useParams } from "next/navigation";
import { usePageById } from "@/hooks/usePages";
import { Skeleton } from "@/components/ui/skeleton";
import EditPageForm from "@/components/forms/EditPageForm";

export default function EditPage() {
    const params = useParams();
    const pageId = params.id as string;
    const { data: page, isLoading, error } = usePageById(pageId);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="text-center py-16">
                <h2 className="text-lg font-semibold text-gray-900">Page not found</h2>
                <p className="text-sm text-muted-foreground">
                    This page doesn&apos;t exist or you don&apos;t have access to it.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Edit: {page.business_name}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Update your page details. Changes to your business name or products
                    will re-trigger AI content generation.
                </p>
            </div>
            <EditPageForm page={page} />
        </div>
    );
}
