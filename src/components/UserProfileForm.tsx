"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/portal/actions";
import { User, Phone, Globe, Lock, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfileFormProps {
  initialData: {
    name: string;
    phone: string | null;
    languagePreference: string;
  };
}

export default function UserProfileForm({ initialData }: UserProfileFormProps) {
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone || "");
  const [languagePreference, setLanguagePreference] = useState(initialData.languagePreference);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Името е задължително.");
      return;
    }

    if (password && password.length < 6) {
      setError("Паролата трябва да бъде поне 6 символа.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролите не съвпадат.");
      return;
    }

    startTransition(async () => {
      const res = await updateProfile({
        name,
        phone: phone || undefined,
        languagePreference,
        password: password || undefined,
      });

      if (res.success) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        router.refresh();
      } else {
        setError(res.error || "Грешка при актуализиране.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      {error && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-950/20 border border-green-900/30 text-green-400 rounded-lg flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span>Профилът е обновен успешно!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
            <User className="h-3 w-3 text-cyan-400" />
            <span>Име на потребител / Лице за контакт *</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg focus:border-blue-500 outline-none text-white font-medium"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
            <Phone className="h-3 w-3 text-cyan-400" />
            <span>Телефон за контакт</span>
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="напр. +359 88 800 2455"
            className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg focus:border-blue-500 outline-none text-white font-medium"
          />
        </div>

        {/* Language Preference */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
            <Globe className="h-3 w-3 text-cyan-400" />
            <span>Предпочитан език</span>
          </label>
          <select
            value={languagePreference}
            onChange={(e) => setLanguagePreference(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg focus:border-blue-500 outline-none text-white font-medium"
          >
            <option value="bg">Български (BG)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-850/60">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Lock className="h-3.5 w-3.5 text-cyan-400" />
          <span>Промяна на парола (незадължително)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Нова парола</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символа"
              className="w-full bg-slate-900 border border-slate-855 p-3 rounded-lg focus:border-blue-500 outline-none text-white font-mono"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Потвърди новата парола</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторете новата парола"
              className="w-full bg-slate-900 border border-slate-855 p-3 rounded-lg focus:border-blue-500 outline-none text-white font-mono"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>Запази промените</span>
      </button>
    </form>
  );
}
