"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { loginSchema } from "@/lib/validation";
import { Cpu, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

function LoginContent() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal";

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate inputs with Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : (isBg ? "Неуспешен вход. Опитайте пак." : "Login failed.");
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#07111F] pt-24 pb-20 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        
        {/* Logo */}
        <div className="text-center mb-8 space-y-3">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Алми Груп</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">
            {isBg ? "Вход в ИТ Портала" : "Log in to IT Portal"}
          </h1>
          <p className="text-xs text-slate-450">
            {isBg 
              ? "Влезте, за да управлявате Вашите заявки, оферти и чат." 
              : "Access your support tickets, device registry, and chat."}
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">{t.forms.email}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder={t.forms.placeholders.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 p-3 pl-10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-650"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                {isBg ? "Парола" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 p-3 pl-10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-650"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-3 rounded border border-red-500/10">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBg ? "Влизане..." : "Logging in..."}</span>
                </>
              ) : (
                <span>{t.nav.login}</span>
              )}
            </button>
          </form>

          {/* Seed info hint to make testing easy for user */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 text-[10px] text-slate-450 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-300 uppercase tracking-wide">
              🔑 {isBg ? "Тестови акаунти (Парола: demo123):" : "Demo Accounts (Password: demo123):"}
            </p>
            <div className="grid grid-cols-1 gap-1">
              <div>• {isBg ? "Администратор:" : "Admin:"} <strong className="text-cyan-400">admin@almi.bg</strong> (pass: <strong className="text-cyan-400">admin123</strong>)</div>
              <div>• {isBg ? "Техник:" : "Technician:"} <strong className="text-cyan-400">tech@almi.bg</strong> (pass: <strong className="text-cyan-400">tech123</strong>)</div>
              <div>• {isBg ? "Фирмен клиент:" : "Company client:"} <strong className="text-cyan-400">manager@agrocom.bg</strong> (pass: <strong className="text-cyan-400">company123</strong>)</div>
              <div>• {isBg ? "Частен клиент:" : "Private client:"} <strong className="text-cyan-400">ivan@mail.bg</strong> (pass: <strong className="text-cyan-400">client123</strong>)</div>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2">
            <span>{isBg ? "Нямате акаунт?" : "Don't have an account?"} </span>
            <Link href="/registraciya" className="text-cyan-400 hover:underline font-semibold">
              {t.nav.register}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07111F] pt-32 text-center text-slate-500 text-xs">
        Зареждане на формата...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
