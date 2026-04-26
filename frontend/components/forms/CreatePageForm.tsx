"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    ChevronDown,
    Loader2,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import { useCreatePage } from "@/hooks/usePages";
import {
    uploadLogo,
    uploadProductImage,
    updatePage,
} from "@/lib/api";

import PhoneInput from "@/components/forms/PhoneInput";
import ImageUploadBox from "@/components/forms/ImageUploadBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    image_urls: z.array(z.string()).max(5).optional(),
});

const whatsappNumberSchema = z.string()
    .min(1, "WhatsApp number is required")
    .refine((val) => {
        const digits = val.replace(/^\+\d{1,4}/, "");
        return /^\d{7,12}$/.test(digits);
    }, "Enter 7–12 digits after the country code");

const phoneNumberSchema = z.string().optional()
    .refine((val) => {
        if (!val || val.trim() === "") return true;
        const digits = val.replace(/^\+\d{1,4}/, "");
        return /^\d{7,12}$/.test(digits);
    }, "Enter 7–12 digits after the country code");

const formSchema = z.object({
    business_name: z.string().min(1, "Business name is required").max(255),
    category: z.string().min(1, "Select a category"),
    whatsapp_number: whatsappNumberSchema,
    phone_number: phoneNumberSchema,
    products: z.array(productSchema).max(10, "Maximum 10 products"),
    theme: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

function parseError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}

function filePreview(file: File | null): string | null {
    return file ? URL.createObjectURL(file) : null;
}

export default function CreatePageForm() {
    const router = useRouter();
    const createPage = useCreatePage();

    const [step, setStep] = useState(1);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productImageFiles, setProductImageFiles] = useState<Array<File[]>>([]);
    const [openCards, setOpenCards] = useState<Set<number>>(new Set());
    const productNameRefs = useRef<Array<HTMLInputElement | null>>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            business_name: "",
            category: "",
            whatsapp_number: "",
            phone_number: "",
            products: [],
            theme: "default",
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const watchedProducts = form.watch("products");

    const fieldsByStep: Record<number, Array<keyof FormValues>> = {
        1: ["business_name", "category", "whatsapp_number", "phone_number", "theme"],
        2: ["products"],
    };

    const totalPendingUploads = useMemo(() => {
        return productImageFiles.reduce((sum, arr) => sum + arr.length, 0);
    }, [productImageFiles]);

    const toggleCard = (index: number) => {
        setOpenCards((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const addProductImageFile = (productIndex: number, file: File) => {
        setProductImageFiles((prev) => {
            const next = [...prev];
            while (next.length <= productIndex) next.push([]);
            if (next[productIndex].length >= 5) return prev;
            next[productIndex] = [...next[productIndex], file];
            return next;
        });
    };

    const removeProductImageFile = (productIndex: number, fileIndex: number) => {
        setProductImageFiles((prev) => {
            const next = [...prev];
            next[productIndex] = next[productIndex].filter((_, i) => i !== fileIndex);
            return next;
        });
    };

    const handleProductRemove = (index: number) => {
        remove(index);
        setProductImageFiles((prev) => prev.filter((_, i) => i !== index));
        setOpenCards((prev) => {
            const next = new Set<number>();
            prev.forEach((v) => { if (v < index) next.add(v); else if (v > index) next.add(v - 1); });
            return next;
        });
    };

    const validateStep = async () => {
        return form.trigger(fieldsByStep[step]);
    };

    const handleNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        const valid = await validateStep();
        if (valid) {
            setStep((prev) => Math.min(2, prev + 1));
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep((prev) => Math.max(1, prev - 1));
    };

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        const loadingToast = toast.loading("Creating your page...");

        try {
            let logoUrl: string | null = null;
            if (logoFile) {
                toast.loading("Uploading logo...", { id: loadingToast });
                logoUrl = await uploadLogo(logoFile);
            }

            const payload = {
                business_name: values.business_name,
                category: values.category,
                whatsapp_number: values.whatsapp_number,
                phone_number: values.phone_number?.trim() ? values.phone_number.trim() : null,
                is_online_only: true,
                location: null as string | null,
                business_hours: null,
                products: values.products.length > 0 ? values.products : undefined,
                theme: "default",
            };

            const createdPage = await createPage.mutateAsync(payload);

            const patchData: {
                logo_url?: string;
            } = {};

            let uploadCount = 0;

            for (let i = 0; i < productImageFiles.length; i += 1) {
                const files = productImageFiles[i];
                if (!files || files.length === 0) continue;
                for (const file of files) {
                    toast.loading(`Uploading product images... (${++uploadCount}/${totalPendingUploads})`, {
                        id: loadingToast,
                    });
                    await uploadProductImage(file, createdPage.id, i);
                }
            }

            if (logoUrl) {
                patchData.logo_url = logoUrl;
            }

            if (Object.keys(patchData).length > 0) {
                await updatePage(createdPage.id, patchData);
            }

            toast.success("Page created successfully!", { id: loadingToast });
            router.push("/dashboard");
        } catch (error) {
            toast.error(parseError(error, "Something went wrong. Please try again."), {
                id: loadingToast,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center w-full">
                <div
                    className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                        1 <= step ? "bg-[#25D366] text-white" : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300",
                    ].join(" ")}
                >
                    1
                </div>
                <div
                    className={[
                        "h-1 flex-1 mx-4 rounded-full transition-colors",
                        1 < step ? "bg-[#25D366]" : "bg-gray-200 dark:bg-zinc-700",
                    ].join(" ")}
                />
                <div
                    className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                        2 <= step ? "bg-[#25D366] text-white" : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300",
                    ].join(" ")}
                >
                    2
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 ? (
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-zinc-900 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-gray-900 font-bold dark:text-gray-100">Business Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="business_name" className="text-gray-900 font-semibold dark:text-gray-200">Business Name *</Label>
                                    <Input id="business_name" placeholder="e.g. Ahmed's Biryani House" className="bg-white border-gray-300 text-gray-900 font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-100 dark:placeholder:text-zinc-500" {...form.register("business_name")} />
                                    {form.formState.errors.business_name ? (
                                        <p className="text-sm text-red-500">{form.formState.errors.business_name.message}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-gray-900 font-semibold dark:text-gray-200">Category *</Label>
                                    <select
                                        id="category"
                                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
                                        value={form.watch("category")}
                                        onChange={(event) => form.setValue("category", event.target.value, { shouldValidate: true })}
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((category) => (
                                            <option key={category} value={category.toLowerCase()}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {form.formState.errors.category ? (
                                        <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                                    ) : null}
                                </div>

                                <PhoneInput
                                    id="whatsapp_number"
                                    label="WhatsApp Number"
                                    required
                                    value={form.watch("whatsapp_number")}
                                    onChange={(val) => form.setValue("whatsapp_number", val, { shouldValidate: true })}
                                    error={form.formState.errors.whatsapp_number?.message}
                                />

                                <PhoneInput
                                    id="phone_number"
                                    label="Phone Number"
                                    hint="(optional) For a call button on your page"
                                    value={form.watch("phone_number") ?? ""}
                                    onChange={(val) => form.setValue("phone_number", val, { shouldValidate: true })}
                                    error={form.formState.errors.phone_number?.message}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-zinc-900 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-gray-900 font-bold dark:text-gray-100">Logo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <Label className="text-gray-900 font-semibold dark:text-gray-200">
                                    Logo <span className="text-xs text-gray-600 font-medium dark:text-zinc-400">(optional)</span>
                                </Label>
                                <ImageUploadBox
                                    label="Upload Logo"
                                    hint="Square logo - Max 2MB"
                                    aspectRatio="1 / 1"
                                    currentImageUrl={filePreview(logoFile)}
                                    onFileSelect={(file) => {
                                        if (file.size > 2 * 1024 * 1024) {
                                            toast.error("Logo must be under 2 MB");
                                            return;
                                        }
                                        setLogoFile(file);
                                    }}
                                    onRemove={() => setLogoFile(null)}
                                />
                            </CardContent>
                        </Card>
                    </div>
                ) : null}

                {step === 2 ? (
                    <Card className="bg-white dark:bg-zinc-900 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-gray-900 font-bold dark:text-gray-100">Products & Services</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => {
                                const isOpen = openCards.has(index);
                                const productName = watchedProducts[index]?.name;
                                const headerLabel = productName?.trim() || `Product ${index + 1}`;
                                const currentFiles = productImageFiles[index] ?? [];

                                return (
                                    <div key={field.id} className="rounded-xl border border-gray-200 transition-colors dark:border-zinc-700">
                                        {/* Accordion header */}
                                        <button
                                            type="button"
                                            onClick={() => toggleCard(index)}
                                            className="flex w-full items-center justify-between rounded-t-xl px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/40 dark:text-gray-100"
                                        >
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">{headerLabel}</span>
                                            <div className="flex items-center gap-1">
                                                <ChevronDown className={["h-4 w-4 text-gray-500 dark:text-zinc-400 transition-transform duration-200", isOpen ? "rotate-180" : ""].join(" ")} />
                                            </div>
                                        </button>

                                        {/* Collapsible body */}
                                        {isOpen ? (
                                            <div className="space-y-3 border-t border-gray-200 px-4 pb-4 pt-3 dark:border-zinc-700">
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-3">
                                                        <Input
                                                            placeholder="Product name *"
                                                            className="bg-white border-gray-300 text-gray-900 font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-100 dark:placeholder:text-zinc-500"
                                                            {...form.register(`products.${index}.name`)}
                                                            ref={(el) => {
                                                                form.register(`products.${index}.name`).ref(el);
                                                                productNameRefs.current[index] = el;
                                                            }}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Input placeholder="Price (e.g. ৳250)" className="w-36 bg-white border-gray-300 text-gray-900 font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-100 dark:placeholder:text-zinc-500" {...form.register(`products.${index}.price`)} />
                                                            <Input placeholder="Description" className="flex-1 bg-white border-gray-300 text-gray-900 font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-100 dark:placeholder:text-zinc-500" {...form.register(`products.${index}.description`)} />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="shrink-0 text-red-500 hover:text-red-600"
                                                        onClick={() => handleProductRemove(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Multi-image upload row */}
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Images <span className="text-xs text-gray-600 font-medium dark:text-zinc-400">(up to 5, optional)</span></p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {currentFiles.map((file, fileIdx) => (
                                                            <div key={fileIdx} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`Product ${index + 1} image ${fileIdx + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeProductImageFile(index, fileIdx)}
                                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                                                >
                                                                    <X className="h-5 w-5 text-white" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {currentFiles.length < 5 ? (
                                                            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-dashed border-indigo-500/30 bg-indigo-500/5 transition-colors hover:border-indigo-400 hover:bg-indigo-500/10">
                                                                <Plus className="h-5 w-5 text-indigo-400/80" />
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg,image/png,image/webp"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const f = e.target.files?.[0];
                                                                        if (!f) return;
                                                                        if (f.size > 3 * 1024 * 1024) { toast.error("Product image must be under 3 MB"); return; }
                                                                        addProductImageFile(index, f);
                                                                        e.target.value = "";
                                                                    }}
                                                                />
                                                            </label>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}

                            {fields.length < 10 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-gray-300 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    onClick={() => {
                                        const newIndex = fields.length;
                                        append({ name: "", price: "", description: "", image_urls: [] });
                                        setProductImageFiles((prev) => [...prev, []]);
                                        setOpenCards((prev) => new Set(prev).add(newIndex));
                                        setTimeout(() => {
                                            productNameRefs.current[newIndex]?.focus();
                                            productNameRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
                                        }, 100);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Product
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                ) : null}



                <div className="flex justify-between">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={handleBack} className="dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 2 ? (
                        <Button type="button" className="bg-[#25D366] text-white hover:bg-[#1ea851]" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="min-w-[220px] bg-[#25D366] text-white hover:bg-[#1ea851]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create My Page"
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
