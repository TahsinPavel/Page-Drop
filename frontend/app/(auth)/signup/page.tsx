"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Rocket } from "lucide-react";
import { register as registerApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

const schema = z.object({
    full_name: z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
    const router = useRouter();
    const loginStore = useAuthStore((s) => s.login);
    const [loading, setLoading] = useState(false);

    const {
        register: reg,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const res = await registerApi(data.email, data.password, data.full_name);
            loginStore(res.access_token, res.user);
            document.cookie = `token=${res.access_token}; path=/; max-age=${7 * 24 * 3600}`;
            toast.success("Account created! Welcome to PageDrop 🎉");
            router.push("/dashboard");
        } catch {
            toast.error("Could not create account. Email may already be registered.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href="/" className="mx-auto mb-2 flex items-center gap-2 font-bold text-xl">
                        <Rocket className="h-6 w-6 text-[#25D366]" />
                        Page<span className="text-[#25D366]">Drop</span>
                    </Link>
                    <CardTitle className="text-2xl">Create your account</CardTitle>
                    <CardDescription>Start building your landing page</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name (optional)</Label>
                            <Input id="full_name" placeholder="Ahmed Khan" {...reg("full_name")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" {...reg("email")} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" {...reg("password")} />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#1da851] text-white" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-[#25D366] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
