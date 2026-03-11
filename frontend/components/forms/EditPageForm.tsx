"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Plus,
    Trash2,
    Loader2,
    Upload,
    ExternalLink,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import { useUpdatePage, useDeletePage, useRegenerateAI } from "@/hooks/usePages";
import { uploadLogo } from "@/lib/api";
import toast from "react-hot-toast";
import type { BusinessPage } from "@/types";

const CATEGORIES = [
    "Restaurant", "Salon & Spa", "Retail Shop", "Clothing", "Electronics",
    "Pharmacy", "Bakery", "Grocery", "Fitness", "Education", "Other",
];

const THEMES = [
    { value: "default", label: "Default", desc: "Clean white, green accents", color: "bg-white border-[#25D366]" },
    { value: "dark", label: "Dark", desc: "Modern dark mode", color: "bg-gray-900 border-green-400" },
    { value: "minimal", label: "Minimal", desc: "Pure & simple", color: "bg-white border-gray-300" },
    { value: "vibrant", label: "Vibrant", desc: "Bold & colorful", color: "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500" },
];

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.string(),
    description: z.string(),
});

const editSchema = z.object({
    business_name: z.string().min(1, "Business name is required"),
    category: z.string().min(1, "Select a category"),
    whatsapp_number: z.string().min(6, "Valid WhatsApp number is required"),
    location: z.string(),
    products: z.array(productSchema).max(10),
    theme: z.string(),
});

interface EditFormValues {
    business_name: string;
    category: string;
    whatsapp_number: string;
    location: string;
    products: { name: string; price: string; description: string }[];
    theme: string;
}

interface EditPageFormProps {
    page: BusinessPage;
}

export default function EditPageForm({ page }: EditPageFormProps) {
    const router = useRouter();
    const updatePageMutation = useUpdatePage(page.id);
    const deletePageMutation = useDeletePage();
    const regenerateAIMutation = useRegenerateAI(page.id);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            business_name: page.business_name,
            category: page.category,
            whatsapp_number: page.whatsapp_number,
            location: page.location ?? "",
            products: (page.products ?? []).map(p => ({ name: p.name, price: p.price, description: p.description ?? "" })),
            theme: page.theme,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const onSubmit = async (data: EditFormValues) => {
        try {
            let logoUrl: string | undefined;
            if (logoFile) {
                logoUrl = await uploadLogo(logoFile);
            }

            await updatePageMutation.mutateAsync({
                business_name: data.business_name,
                category: data.category,
                whatsapp_number: data.whatsapp_number,
                location: data.location || undefined,
                products: data.products.length > 0 ? data.products : undefined,
                theme: data.theme,
                logo_url: logoUrl,
            });

            toast.success("Page updated successfully!");
        } catch {
            toast.error("Failed to update page.");
        }
    };

    const handleRegenerate = async () => {
        try {
            await regenerateAIMutation.mutateAsync();
            toast.success("AI content regenerated!");
        } catch {
            toast.error("Failed to regenerate AI content.");
        }
    };

    const handleDelete = async () => {
        try {
            await deletePageMutation.mutateAsync(page.id);
            toast.success("Page deleted.");
            router.push("/dashboard");
        } catch {
            toast.error("Failed to delete page.");
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* AI Preview Panel */}
            {page.is_ai_generated && (
                <Card className="border-[#25D366]/30 bg-[#25D366]/5">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">AI-Generated Content</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={handleRegenerate}
                                disabled={regenerateAIMutation.isPending}
                            >
                                {regenerateAIMutation.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-3.5 w-3.5" />
                                )}
                                Regenerate AI
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><span className="font-medium">Headline:</span> {page.ai_headline}</p>
                        <p><span className="font-medium">Subheadline:</span> {page.ai_subheadline}</p>
                        <p><span className="font-medium">About:</span> {page.ai_about}</p>
                        <p><span className="font-medium">CTA:</span> {page.ai_cta_text}</p>
                    </CardContent>
                </Card>
            )}

            {/* View live link */}
            <div className="flex justify-end">
                <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Live Page
                    </Button>
                </a>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Business Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input id="business_name" {...form.register("business_name")} />
                            {form.formState.errors.business_name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.business_name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={form.watch("category")}
                                onValueChange={(v) => form.setValue("category", v, { shouldValidate: true })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                            <Input id="whatsapp_number" {...form.register("whatsapp_number")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...form.register("location")} />
                        </div>
                    </CardContent>
                </Card>

                {/* Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products & Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 rounded-lg border p-3 items-start">
                                <div className="flex-1 space-y-2">
                                    <Input placeholder="Product name *" {...form.register(`products.${index}.name`)} />
                                    <div className="flex gap-2">
                                        <Input placeholder="Price" className="w-28" {...form.register(`products.${index}.price`)} />
                                        <Input placeholder="Description" className="flex-1" {...form.register(`products.${index}.description`)} />
                                    </div>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {fields.length < 10 && (
                            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => append({ name: "", price: "", description: "" })}>
                                <Plus className="h-4 w-4" /> Add Product
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Theme */}
                <Card>
                    <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {THEMES.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => form.setValue("theme", t.value)}
                                    className={`rounded-xl border-2 p-4 text-left transition-all ${form.watch("theme") === t.value ? "border-[#25D366] ring-2 ring-[#25D366]/20" : "border-border"
                                        }`}
                                >
                                    <div className={`mb-2 h-12 rounded-lg ${t.color} border`} />
                                    <p className="font-medium text-sm">{t.label}</p>
                                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Logo */}
                <Card>
                    <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
                    <CardContent>
                        {page.logo_url && (
                            <div className="mb-4">
                                <img src={page.logo_url} alt="Current logo" className="h-20 w-20 rounded-lg object-cover" />
                            </div>
                        )}
                        <div
                            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 hover:border-[#25D366]/40"
                            onClick={() => document.getElementById("edit-logo-upload")?.click()}
                        >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {logoFile ? logoFile.name : "Upload new logo"}
                            </p>
                            <input id="edit-logo-upload" type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f && f.size <= 2 * 1024 * 1024) setLogoFile(f);
                                    else if (f) toast.error("File must be under 2 MB");
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white"
                    disabled={updatePageMutation.isPending}
                >
                    {updatePageMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </form>

            {/* Danger Zone */}
            <Separator />
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" /> Danger Zone
                    </CardTitle>
                    <CardDescription>This action cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete this page</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This will permanently deactivate &quot;{page.business_name}&quot;. This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deletePageMutation.isPending}
                                >
                                    {deletePageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
