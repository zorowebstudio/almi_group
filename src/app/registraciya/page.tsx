"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { registerSchema } from "@/lib/validation";
import { Cpu, Mail, Lock, User, Phone, Building2, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";
  const router = useRouter();

  // Form fields
  const [role, setRole] = useState<"CUSTOMER_PRIVATE" | "CUSTOMER_COMPANY">("CUSTOMER_PRIVATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [eik, setEik] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const body = {
      name,
      email,
      phone,
      password,
      role,
      companyName: role === "CUSTOMER_COMPANY" ? companyName : undefined,
      eik: role === "CUSTOMER_COMPANY" ? eik : undefined,
    };

    // Validate with Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/portal");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : (isBg ? "Възникна грешка при регистрация." : "Registration failed.");
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#07111F] pt-24 pb-20 min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        
        {/* Header logo */}
        <div className="text-center mb-6 space-y-3">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Алми Груп</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">
            {t.nav.register}
          </h1>
          <p className="text-xs text-slate-450">
            {isBg
              ? "Създайте профил за бързо подаване и проследяване на заявки."
              : "Create an account to submit and track support tickets faster."}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-850">
            <button
              type="button"
              onClick={() => {
                setRole("CUSTOMER_PRIVATE");
                setErrorMsg("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                role === "CUSTOMER_PRIVATE"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isBg ? "Физическо лице" : "Private Client"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("CUSTOMER_COMPANY");
                setErrorMsg("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                role === "CUSTOMER_COMPANY"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isBg ? "Юридическо лице" : "Company / B2B"}
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">{t.forms.fullName} *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder={t.forms.placeholders.fullName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 p-3 pl-10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-650"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">{t.forms.email} *</label>
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
              <label className="block text-xs text-slate-400 mb-1.5">{t.forms.phone} *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder={t.forms.placeholders.phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 p-3 pl-10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-650"
                />
              </div>
            </div>

            {role === "CUSTOMER_COMPANY" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{t.forms.companyName} *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder={t.forms.placeholders.companyName}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 pl-10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-650"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{t.forms.eik}</label>
                  <input
                    type="text"
                    placeholder="123456789"
                    value={eik}
                    onChange={(e) => setEik(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                {isBg ? "Парола (поне 6 символа)" : "Password (at least 6 characters)"} *
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
                  <span>{isBg ? "Регистриране..." : "Registering..."}</span>
                </>
              ) : (
                <span>{isBg ? "Създай акаунт" : "Register"}</span>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2">
            <span>{isBg ? "Вече имате профил?" : "Already have an account?"} </span>
            <Link href="/vhod" className="text-cyan-400 hover:underline font-semibold">
              {t.nav.login}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
