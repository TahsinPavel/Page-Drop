"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    AlertTriangle,
    ExternalLink,
    Globe,
    Loader2,
    MapPin,
    Plus,
    Trash2,
} from "lucide-react";

import { useDeletePage, useUpdatePage } from "@/hooks/usePages";
import {
    deleteProductImage,
    uploadLogo,
    uploadProductImage,
} from "@/lib/api";
import type { BusinessPage } from "@/types";

import ImageUploadBox from "@/components/forms/ImageUploadBox";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const CATEGORIES = [
    "Restaurant",
    "Salon & Spa",
    "Retail Shop",
    "Clothing",
    "Electronics",
    "Pharmacy",
    "Bakery",
    "Grocery",
    "Fitness",
    "Education",
    "Other",
];

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.string().optional(),
    description: z.string().optional(),
    image_url: z.string().nullable().optional(),
});

const editSchema = z.object({
    business_name: z.string().min(1, "Business name is required"),
    category: z.string().min(1, "Select a category"),
    whatsapp_number: z.string().min(6, "Valid WhatsApp number is required"),
    phone_number: z.string().optional(),
    products: z.array(productSchema).max(10),
    theme: z.string(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditPageFormProps {
    page: BusinessPage;
}

function parseError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}

export default function EditPageForm({ page }: EditPageFormProps) {
    const router = useRouter();
    const updatePageMutation = useUpdatePage(page.id);
    const deletePageMutation = useDeletePage();

    const [logoUploading, setLogoUploading] = useState(false);
    const [productUploadingIndex, setProductUploadingIndex] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            business_name: page.business_name,
            category: page.category,
            whatsapp_number: page.whatsapp_number,
            phone_number: page.phone_number ?? "",
            products: (page.products ?? []).map((item) => ({
                name: item.name,
                price: item.price ?? "",
                description: item.description ?? "",
                image_url: item.image_url ?? null,
            })),
            theme: page.theme,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const values = form.watch();

    const liveLink = useMemo(() => `/${page.slug}`, [page.slug]);

    const onSubmit = async (data: EditFormValues) => {
        try {
            await updatePageMutation.mutateAsync({
                business_name: data.business_name,
                category: data.category,
                whatsapp_number: data.whatsapp_number,
                phone_number: data.phone_number?.trim() ? data.phone_number.trim() : null,
                is_online_only: false,
                location: null,
                business_hours: null,
                products: data.products,
                theme: "default",
            });

            toast.success("Page updated successfully!");
        } catch (error) {
            toast.error(parseError(error, "Failed to update page."));
        }
    };

    const handleDelete = async () => {
        try {
            await deletePageMutation.mutateAsync(page.id);
            toast.success("Page deleted.");
            router.push("/dashboard");
        } catch (error) {
            toast.error(parseError(error, "Failed to delete page."));
        }
    };

    const handleLogoUpload = async (file: File) => {
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Logo must be under 2 MB");
            return;
        }

        setLogoUploading(true);
        try {
            const logoUrl = await uploadLogo(file);
            await updatePageMutation.mutateAsync({ logo_url: logoUrl });
            toast.success("Logo updated");
        } catch (error) {
            toast.error(parseError(error, "Failed to upload logo"));
        } finally {
            setLogoUploading(false);
        }
    };

    const handleProductImageUpload = async (file: File, index: number) => {
        if (file.size > 3 * 1024 * 1024) {
            toast.error("Product image must be under 3 MB");
            return;
        }

        setProductUploadingIndex(index);
        try {
            const response = await uploadProductImage(file, page.id, index);
            form.setValue(
                "products",
                response.products.map((product) => ({
                    name: product.name,
                    price: product.price,
                    description: product.description ?? undefined,
                    image_url: product.image_url ?? null,
                })),
                { shouldDirty: true }
            );
            toast.success(`Product image updated (${index + 1})`);
        } catch (error) {
            toast.error(parseError(error, "Failed to upload product image"));
        } finally {
            setProductUploadingIndex(null);
        }
    };

    const handleProductImageRemove = async (index: number) => {
        setProductUploadingIndex(index);
        try {
            await deleteProductImage(page.id, index);
            const next = [...(form.getValues("products") ?? [])];
            if (next[index]) {
                next[index] = {
                    ...next[index],
                    image_url: null,
                };
                form.setValue("products", next, { shouldDirty: true });
            }
            toast.success("Product image removed");
        } catch (error) {
            toast.error(parseError(error, "Failed to remove product image"));
        } finally {
            setProductUploadingIndex(null);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex justify-end">
                <a href={liveLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Live Page
                    </Button>
                </a>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input id="business_name" {...form.register("business_name")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                value={values.category}
                                onChange={(event) => form.setValue("category", event.target.value, { shouldValidate: true })}
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category.toLowerCase()}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                            <Input id="whatsapp_number" {...form.register("whatsapp_number")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number" className="flex items-center gap-2">
                                Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
                            </Label>
                            <Input id="phone_number" placeholder="+8801XXXXXXXXX" {...form.register("phone_number")} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Products & Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="space-y-3 rounded-xl border p-4">
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-3">
                                        <Input placeholder="Product name *" {...form.register(`products.${index}.name`)} />
                                        <div className="flex gap-2">
                                            <Input placeholder="Price" className="w-32" {...form.register(`products.${index}.price`)} />
                                            <Input placeholder="Description" className="flex-1" {...form.register(`products.${index}.description`)} />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <ImageUploadBox
                                    label="Product Image"
                                    hint="Square image recommended - Max 3MB"
                                    aspectRatio="1 / 1"
                                    currentImageUrl={values.products[index]?.image_url ?? null}
                                    loading={productUploadingIndex === index}
                                    onFileSelect={(file) => handleProductImageUpload(file, index)}
                                    onRemove={() => handleProductImageRemove(index)}
                                />
                            </div>
                        ))}

                        {fields.length < 10 ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => append({ name: "", price: "", description: "", image_url: null })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        ) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Logo</Label>
                            <ImageUploadBox
                                label="Upload Logo"
                                hint="Square logo - Max 2MB"
                                aspectRatio="1 / 1"
                                currentImageUrl={page.logo_url}
                                loading={logoUploading}
                                onFileSelect={handleLogoUpload}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    className="w-full bg-[#25D366] text-white hover:bg-[#1ea851]"
                    disabled={updatePageMutation.isPending}
                >
                    {updatePageMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </form>

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
                                    This will permanently deactivate {page.business_name}. This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deletePageMutation.isPending}
                                >
                                    {deletePageMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
