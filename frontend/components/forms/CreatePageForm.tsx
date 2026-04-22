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
    uploadBanner,
    uploadLogo,
    uploadProductImage,
    updatePage,
} from "@/lib/api";
import type { BusinessHours } from "@/types";

import PhoneInput from "@/components/forms/PhoneInput";
import ImageUploadBox from "@/components/forms/ImageUploadBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

type DayKey = keyof NonNullable<BusinessHours>;

const DAY_OPTIONS: Array<{ key: DayKey; label: string }> = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
];

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.string().optional(),
    description: z.string().optional(),
    image_urls: z.array(z.string()).max(5).optional(),
});

const businessHoursDaySchema = z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
});

const businessHoursSchema = z
    .object({
        monday: businessHoursDaySchema.optional(),
        tuesday: businessHoursDaySchema.optional(),
        wednesday: businessHoursDaySchema.optional(),
        thursday: businessHoursDaySchema.optional(),
        friday: businessHoursDaySchema.optional(),
        saturday: businessHoursDaySchema.optional(),
        sunday: businessHoursDaySchema.optional(),
    })
    .nullable()
    .optional();

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
    business_hours: businessHoursSchema,
});

type FormValues = z.infer<typeof formSchema>;

function makeDefaultHours(): NonNullable<FormValues["business_hours"]> {
    return {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "22:00", closed: false },
        saturday: { open: "09:00", close: "22:00", closed: false },
        sunday: { open: "09:00", close: "22:00", closed: true },
    };
}

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
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [showBusinessHours, setShowBusinessHours] = useState(false);
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
            business_hours: null,
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const watchedProducts = form.watch("products");
    const hours = form.watch("business_hours");

    const fieldsByStep: Record<number, Array<keyof FormValues>> = {
        1: ["business_name", "category", "whatsapp_number", "phone_number", "business_hours"],
        2: ["products"],
        3: ["theme"],
    };

    const totalPendingUploads = useMemo(() => {
        const productPendingCount = productImageFiles.reduce((sum, arr) => sum + arr.length, 0);
        return (bannerFile ? 1 : 0) + productPendingCount;
    }, [bannerFile, productImageFiles]);

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

    const handleNext = async () => {
        const valid = await validateStep();
        if (valid) {
            setStep((prev) => Math.min(3, prev + 1));
        }
    };

    const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

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
                business_hours: showBusinessHours ? values.business_hours ?? null : null,
                products: values.products.length > 0 ? values.products : undefined,
                theme: "default",
            };

            const createdPage = await createPage.mutateAsync(payload);

            const patchData: {
                logo_url?: string;
                banner_image_url?: string;
            } = {};

            let uploadCount = 0;

            if (bannerFile && totalPendingUploads > 0) {
                toast.loading(`Uploading banner... (${++uploadCount}/${totalPendingUploads})`, {
                    id: loadingToast,
                });
                const bannerRes = await uploadBanner(bannerFile, createdPage.slug);
                patchData.banner_image_url = bannerRes.banner_url;
            }

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
            <div className="mb-8 flex items-center gap-2">
                {[1, 2, 3].map((value) => (
                    <div key={value} className="flex flex-1 items-center gap-2">
                        <div
                            className={[
                                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                                value <= step ? "bg-[#25D366] text-white" : "bg-gray-200 text-gray-500",
                            ].join(" ")}
                        >
                            {value}
                        </div>
                        {value < 3 ? (
                            <div
                                className={[
                                    "h-1 flex-1 rounded-full transition-colors",
                                    value < step ? "bg-[#25D366]" : "bg-gray-200",
                                ].join(" ")}
                            />
                        ) : null}
                    </div>
                ))}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="business_name">Business Name *</Label>
                                <Input id="business_name" placeholder="e.g. Ahmed's Biryani House" {...form.register("business_name")} />
                                {form.formState.errors.business_name ? (
                                    <p className="text-sm text-red-500">{form.formState.errors.business_name.message}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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

                            <div className="space-y-3 rounded-xl border border-border/60 p-4">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        Business Hours
                                        <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Leave empty if you are available anytime or it varies.
                                    </p>
                                </div>

                                {!showBusinessHours ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-dashed"
                                        onClick={() => {
                                            setShowBusinessHours(true);
                                            form.setValue("business_hours", makeDefaultHours(), { shouldDirty: true });
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Business Hours
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        {DAY_OPTIONS.map((day) => {
                                            const value = hours?.[day.key] ?? { open: "09:00", close: "22:00", closed: day.key === "sunday" };
                                            const disabled = Boolean(value.closed);

                                            return (
                                                <div key={day.key} className="flex flex-col gap-2 rounded-lg border border-border/70 p-3 sm:flex-row sm:items-center">
                                                    <p className="w-20 text-sm font-medium">{day.label}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={!disabled}
                                                            onCheckedChange={(checked) => {
                                                                const nextHours = {
                                                                    ...(hours ?? makeDefaultHours()),
                                                                    [day.key]: {
                                                                        ...(hours?.[day.key] ?? value),
                                                                        closed: !checked,
                                                                    },
                                                                };
                                                                form.setValue("business_hours", nextHours, { shouldDirty: true });
                                                            }}
                                                        />
                                                        <span className="text-xs text-muted-foreground">{disabled ? "Closed" : "Open"}</span>
                                                    </div>
                                                    {!disabled ? (
                                                        <div className="flex items-center gap-2 sm:ml-auto">
                                                            <Input
                                                                type="time"
                                                                value={value.open}
                                                                className="w-32"
                                                                onChange={(event) => {
                                                                    const nextHours = {
                                                                        ...(hours ?? makeDefaultHours()),
                                                                        [day.key]: {
                                                                            ...(hours?.[day.key] ?? value),
                                                                            open: event.target.value,
                                                                        },
                                                                    };
                                                                    form.setValue("business_hours", nextHours, { shouldDirty: true });
                                                                }}
                                                            />
                                                            <span className="text-xs text-muted-foreground">to</span>
                                                            <Input
                                                                type="time"
                                                                value={value.close}
                                                                className="w-32"
                                                                onChange={(event) => {
                                                                    const nextHours = {
                                                                        ...(hours ?? makeDefaultHours()),
                                                                        [day.key]: {
                                                                            ...(hours?.[day.key] ?? value),
                                                                            close: event.target.value,
                                                                        },
                                                                    };
                                                                    form.setValue("business_hours", nextHours, { shouldDirty: true });
                                                                }}
                                                            />
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowBusinessHours(false);
                                                form.setValue("business_hours", null, { shouldDirty: true });
                                            }}
                                            className="text-xs font-medium text-muted-foreground underline underline-offset-4"
                                        >
                                            Remove Hours
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                {step === 2 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Products & Services</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => {
                                const isOpen = openCards.has(index);
                                const productName = watchedProducts[index]?.name;
                                const headerLabel = productName?.trim() || `Product ${index + 1}`;
                                const currentFiles = productImageFiles[index] ?? [];

                                return (
                                    <div key={field.id} className="rounded-xl border transition-colors">
                                        {/* Accordion header */}
                                        <button
                                            type="button"
                                            onClick={() => toggleCard(index)}
                                            className="flex w-full items-center justify-between rounded-t-xl px-4 py-3 text-left transition-colors hover:bg-muted/40"
                                        >
                                            <span className="text-sm font-medium truncate pr-2">{headerLabel}</span>
                                            <div className="flex items-center gap-1">
                                                <ChevronDown className={["h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen ? "rotate-180" : ""].join(" ")} />
                                            </div>
                                        </button>

                                        {/* Collapsible body */}
                                        {isOpen ? (
                                            <div className="space-y-3 border-t px-4 pb-4 pt-3">
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-3">
                                                        <Input
                                                            placeholder="Product name *"
                                                            {...form.register(`products.${index}.name`)}
                                                            ref={(el) => {
                                                                form.register(`products.${index}.name`).ref(el);
                                                                productNameRefs.current[index] = el;
                                                            }}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Input placeholder="Price (e.g. ৳250)" className="w-36" {...form.register(`products.${index}.price`)} />
                                                            <Input placeholder="Description" className="flex-1" {...form.register(`products.${index}.description`)} />
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
                                                    <p className="text-sm font-medium">Images <span className="text-xs text-muted-foreground">(up to 5, optional)</span></p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {currentFiles.map((file, fileIdx) => (
                                                            <div key={fileIdx} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border">
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
                                    className="w-full"
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

                {step === 3 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Design</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-1">
                                <Label>Logo <span className="text-xs text-muted-foreground">(optional)</span></Label>
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
                            </div>

                            <div className="space-y-1">
                                <Label>
                                    Page Banner <span className="text-xs text-muted-foreground">(optional)</span>
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    A wide image shown at the top of your page (restaurant food spread, salon interior, etc.)
                                </p>
                                <ImageUploadBox
                                    label="Upload Banner Image"
                                    hint="Recommended: 1200x400px - Max 5MB"
                                    aspectRatio="3 / 1"
                                    currentImageUrl={filePreview(bannerFile)}
                                    onFileSelect={(file) => {
                                        if (file.size > 5 * 1024 * 1024) {
                                            toast.error("Banner must be under 5 MB");
                                            return;
                                        }
                                        setBannerFile(file);
                                    }}
                                    onRemove={() => setBannerFile(null)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    No banner? No problem - your page looks great without one too.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                <div className="flex justify-between">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
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
