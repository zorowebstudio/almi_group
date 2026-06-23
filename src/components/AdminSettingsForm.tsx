"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "@/app/portal/actions";
import { Settings, Save, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingItem {
  key: string;
  value: string;
}

interface AdminSettingsFormProps {
  initialSettings: SettingItem[];
}

export default function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const findValue = (key: string) => {
    return initialSettings.find((s) => s.key === key)?.value || "";
  };

  const [businessEmail, setBusinessEmail] = useState(findValue("business_email"));
  const [businessPhone, setBusinessPhone] = useState(findValue("business_phone"));
  const [addressBg, setAddressBg] = useState(findValue("business_address_bg"));
  const [addressEn, setAddressEn] = useState(findValue("business_address_en"));
  const [hoursBg, setHoursBg] = useState(findValue("working_hours_bg"));
  const [hoursEn, setHoursEn] = useState(findValue("working_hours_en"));
  const [enableEmails, setEnableEmails] = useState(findValue("enable_emails") === "true");
  const [enableUploads, setEnableUploads] = useState(findValue("enable_uploads") === "true");

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    startTransition(async () => {
      const res = await saveSettings([
        { key: "business_email", value: businessEmail },
        { key: "business_phone", value: businessPhone },
        { key: "business_address_bg", value: addressBg },
        { key: "business_address_en", value: addressEn },
        { key: "working_hours_bg", value: hoursBg },
        { key: "working_hours_en", value: hoursEn },
        { key: "enable_emails", value: enableEmails ? "true" : "false" },
        { key: "enable_uploads", value: enableUploads ? "true" : "false" },
      ]);

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        alert("Грешка при запис.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0D1F35] border border-slate-800 p-6 sm:p-8 rounded-xl space-y-6 shadow-md text-xs text-slate-300">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-850">
        <Settings className="h-5 w-5 text-blue-400" />
        <h2 className="text-sm font-extrabold text-white">Редактиране на настройки</h2>
      </div>

      {success && (
        <div className="p-3 bg-green-950/20 border border-green-900/30 text-green-400 rounded-lg flex items-center space-x-2 font-bold">
          <Check className="h-4 w-4" />
          <span>Настройките са актуализирани успешно!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Конфигуриран бизнес имейл</label>
          <input
            type="email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white font-medium"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Телефон за контакти</label>
          <input
            type="text"
            value={businessPhone}
            onChange={(e) => setBusinessPhone(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white font-medium"
          />
        </div>

        {/* Address BG */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Адрес на офиса (Български)</label>
          <input
            type="text"
            value={addressBg}
            onChange={(e) => setAddressBg(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white"
          />
        </div>

        {/* Address EN */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Адрес на офиса (English)</label>
          <input
            type="text"
            value={addressEn}
            onChange={(e) => setAddressEn(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg text-white"
          />
        </div>

        {/* Working Hours BG */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Работно време (Български)</label>
          <input
            type="text"
            value={hoursBg}
            onChange={(e) => setHoursBg(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white"
          />
        </div>

        {/* Working Hours EN */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Working hours (English)</label>
          <input
            type="text"
            value={hoursEn}
            onChange={(e) => setHoursEn(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-850/60 space-y-3.5">
        <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Интеграционни Превключватели</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-emails"
              checked={enableEmails}
              onChange={(e) => setEnableEmails(e.target.checked)}
              className="rounded bg-slate-900 border-slate-850 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="enable-emails" className="text-slate-300 font-semibold cursor-pointer">
              Изпращане на реални имейли (при налични ключове)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-uploads"
              checked={enableUploads}
              onChange={(e) => setEnableUploads(e.target.checked)}
              className="rounded bg-slate-900 border-slate-850 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="enable-uploads" className="text-slate-300 font-semibold cursor-pointer">
              Реално качване в облак (S3/Azure)
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-lg shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4.5 w-4.5" />
        )}
        <span>Запази настройките</span>
      </button>
    </form>
  );
}
