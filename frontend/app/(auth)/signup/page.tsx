"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  Check,
  Star,
  ShieldCheck,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { register as registerApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";
import ThemeToggle from "@/components/ui/ThemeToggle";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

function SignupContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const getStrength = (pw: string) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = getStrength(password);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await registerApi(data.email, data.password, data.full_name);
      login(res.access_token, res.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050508] flex flex-col lg:flex-row transition-colors duration-500">
      {/* ── LEFT SIDE: HERO ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative flex-col justify-between p-12 overflow-hidden bg-white dark:bg-[#050508] border-r border-slate-200 dark:border-white/5">
        {/* Background Mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#25D366]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group mb-20">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6366F1] shadow-lg shadow-[#6366F1]/20 pd-glow-button transition-transform group-hover:scale-110">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-heading tracking-tight text-gray-900 dark:text-white">
              Page<span className="text-[#6366F1]">Drop</span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl xl:text-6xl font-heading leading-[1.1] mb-8 text-gray-900 dark:text-white">
              Build your <span className="text-[#25D366] italic">Luxury</span> sales page in minutes.
            </h1>
            <p className="text-lg text-gray-700 dark:text-white/60 font-sans max-w-md mb-12">
              Join 2,000+ businesses capturing orders directly on WhatsApp with our premium, high-converting templates.
            </p>

            <div className="space-y-6">
              {[
                { icon: Globe, text: "Global reach, WhatsApp direct" },
                { icon: ShieldCheck, text: "Secure & Instant setup" },
                { icon: Zap, text: "AI-powered copywriting" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-gray-800 dark:text-white/80">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    <item.icon size={18} className="text-[#25D366]" />
                  </div>
                  <span className="font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 pt-12 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-[#050508] overflow-hidden bg-gray-100">
                  <img src={`https://i.pravatar.cc/100?u=reg${i}`} alt="user" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-[#25D366] text-[#25D366]" />)}
            </div>
          </div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/60 font-space-grotesk tracking-wide uppercase">
            Rated 4.9/5 by global merchants
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE: FORM ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-y-auto">
        <ThemeToggle />
        
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-3 lg:hidden mb-12">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6366F1] shadow-lg shadow-[#6366F1]/20">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-xl font-heading text-gray-900 dark:text-white">PageDrop</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px]"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading mb-3 text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-gray-800 dark:text-white/80 font-sans">Start your 14-day free trial. No card required.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-white/60 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" />
                <input
                  {...register("full_name")}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-[#12121A] border ${errors.full_name ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} rounded-2xl outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all text-gray-900 dark:text-white font-sans`}
                />
              </div>
              {errors.full_name && <p className="text-xs text-red-500 ml-1">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-white/60 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-[#12121A] border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} rounded-2xl outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all text-gray-900 dark:text-white font-sans`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-white/60 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-14 pl-12 pr-12 bg-white dark:bg-[#12121A] border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} rounded-2xl outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 transition-all text-gray-900 dark:text-white font-sans`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}

              {/* Strength Meter */}
              <div className="pt-2 px-1">
                <div className="flex gap-1.5 mb-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        strength >= i 
                          ? (strength <= 2 ? 'bg-orange-500' : 'bg-[#25D366]') 
                          : 'bg-gray-200 dark:bg-white/5'
                      }`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className={strength <= 2 ? 'text-orange-500' : 'text-[#25D366]'}>
                    {strength === 0 ? '' : strength <= 2 ? 'Weak' : strength === 3 ? 'Good' : 'Strong'}
                  </span>
                  <span className="text-gray-400 dark:text-white/20 italic">8+ chars required</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-indigo-400 text-white font-bold rounded-2xl text-base transition-all transform active:scale-[0.98] shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 text-center">
            <p className="text-sm text-gray-800 dark:text-white/70 font-sans">
              Already have an account?{" "}
              <Link href="/login" className="text-[#6366F1] font-bold hover:underline">
                Log in instead
              </Link>
            </p>
          </div>

          <div className="mt-12 text-[10px] text-center text-gray-600 dark:text-white/40 uppercase tracking-[0.2em] font-bold">
            © 2024 PAGEDROP • PREMIUM SALES ARCHITECTURE
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <SignupContent />
  );
}
