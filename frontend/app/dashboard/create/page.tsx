import type { Metadata } from "next";
import CreatePageForm from "@/components/forms/CreatePageForm";

export const metadata: Metadata = {
    title: "Create New Page — PageDrop",
};

export default function CreatePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Page</h1>
                <p className="text-sm text-muted-foreground">
                    Fill in your business details and let AI do the rest.
                </p>
            </div>
            <CreatePageForm />
        </div>
    );
}
