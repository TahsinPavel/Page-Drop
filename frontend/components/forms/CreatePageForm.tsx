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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2, Upload, CheckCircle } from "lucide-react";
import { useCreatePage } from "@/hooks/usePages";
import { uploadLogo } from "@/lib/api";
import toast from "react-hot-toast";

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

const formSchema = z.object({
    business_name: z.string().min(1, "Business name is required").max(255),
    category: z.string().min(1, "Select a category"),
    whatsapp_number: z.string().min(6, "Valid WhatsApp number is required").max(20),
    location: z.string(),
    products: z.array(productSchema).max(10, "Maximum 10 products"),
    theme: z.string(),
});

interface PageFormValues {
    business_name: string;
    category: string;
    whatsapp_number: string;
    location: string;
    products: { name: string; price: string; description: string }[];
    theme: string;
}

export default function CreatePageForm() {
    const router = useRouter();
    const createPage = useCreatePage();
    const [step, setStep] = useState(1);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            business_name: "",
            category: "",
            whatsapp_number: "+880",
            location: "",
            products: [],
            theme: "default",
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const validateStep = async (): Promise<boolean> => {
        const fieldsByStep: Record<number, (keyof PageFormValues)[]> = {
            1: ["business_name", "category", "whatsapp_number"],
            2: ["products"],
            3: ["theme"],
        };
        const result = await form.trigger(fieldsByStep[step] ?? []);
        return result;
    };

    const handleNext = async () => {
        const valid = await validateStep();
        if (valid) setStep((s) => Math.min(s + 1, 3));
    };

    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    const onSubmit = async (data: PageFormValues) => {
        setIsSubmitting(true);
        try {
            let logoUrl: string | undefined;
            if (logoFile) {
                logoUrl = await uploadLogo(logoFile);
            }

            const payload = {
                business_name: data.business_name,
                category: data.category,
                whatsapp_number: data.whatsapp_number,
                location: data.location || undefined,
                products: data.products.length > 0 ? data.products : undefined,
                theme: data.theme,
            };

            const page = await createPage.mutateAsync(payload);

            if (logoUrl) {
                // Update page with logo
                const { updatePage } = await import("@/lib/api");
                await updatePage(page.id, { logo_url: logoUrl });
            }

            toast.success("Your page is live! AI has generated your content.");
            router.push("/dashboard");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            {/* Progress bar */}
            <div className="mb-8 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-1 items-center gap-2">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${s <= step
                                ? "bg-[#25D366] text-white"
                                : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {s < step ? <CheckCircle className="h-4 w-4" /> : s}
                        </div>
                        {s < 3 && (
                            <div
                                className={`h-1 flex-1 rounded-full transition-colors ${s < step ? "bg-[#25D366]" : "bg-gray-200"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Step 1: Business Info */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="business_name">Business Name *</Label>
                                <Input
                                    id="business_name"
                                    placeholder="e.g. Ahmed's Biryani House"
                                    {...form.register("business_name")}
                                />
                                {form.formState.errors.business_name && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.business_name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <Select
                                    value={form.watch("category")}
                                    onValueChange={(v) => form.setValue("category", v, { shouldValidate: true })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((c) => (
                                            <SelectItem key={c} value={c.toLowerCase()}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.category && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsapp_number">WhatsApp Number *</Label>
                                <Input
                                    id="whatsapp_number"
                                    placeholder="+8801XXXXXXXXX"
                                    {...form.register("whatsapp_number")}
                                />
                                {form.formState.errors.whatsapp_number && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.whatsapp_number.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location (optional)</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Dhanmondi, Dhaka"
                                    {...form.register("location")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Products */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Products & Services</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start"
                                >
                                    <div className="flex-1 space-y-3">
                                        <Input
                                            placeholder="Product name *"
                                            {...form.register(`products.${index}.name`)}
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Price (e.g. ৳250)"
                                                className="w-32"
                                                {...form.register(`products.${index}.price`)}
                                            />
                                            <Input
                                                placeholder="Short description"
                                                className="flex-1"
                                                {...form.register(`products.${index}.description`)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 shrink-0"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {fields.length < 10 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() =>
                                        append({ name: "", price: "", description: "" })
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Product
                                </Button>
                            )}

                            {fields.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-6">
                                    No products added yet. You can add up to 10 products or skip
                                    this step.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Design */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Design & Theme</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                {THEMES.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => form.setValue("theme", t.value)}
                                        className={`rounded-xl border-2 p-4 text-left transition-all ${form.watch("theme") === t.value
                                            ? "border-[#25D366] ring-2 ring-[#25D366]/20"
                                            : "border-border hover:border-[#25D366]/40"
                                            }`}
                                    >
                                        <div
                                            className={`mb-3 h-16 rounded-lg ${t.color} border`}
                                        />
                                        <p className="font-medium text-sm">{t.label}</p>
                                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label>Logo (optional)</Label>
                                <div
                                    className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-[#25D366]/40"
                                    onClick={() =>
                                        document.getElementById("logo-upload")?.click()
                                    }
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {logoFile
                                            ? logoFile.name
                                            : "Click to upload (JPG, PNG, WebP — max 2 MB)"}
                                    </p>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) {
                                                if (f.size > 2 * 1024 * 1024) {
                                                    toast.error("File must be under 2 MB");
                                                    return;
                                                }
                                                setLogoFile(f);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation */}
                <div className="mt-6 flex justify-between">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button
                            type="button"
                            className="bg-[#25D366] hover:bg-[#1da851] text-white"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="bg-[#25D366] hover:bg-[#1da851] text-white min-w-[200px]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    AI is generating your page...
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
