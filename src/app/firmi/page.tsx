"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { Server, ShieldCheck, Clock, Check, HelpCircle, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function BusinessSupportPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  // Form states
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [eik, setEik] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCount, setEmployeeCount] = useState("5");
  const [details, setDetails] = useState("");
  const [backupNeeded, setBackupNeeded] = useState(false);
  const [securityNeeded, setSecurityNeeded] = useState(false);
  const [networkNeeded, setNetworkNeeded] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [generatedNo, setGeneratedNo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !companyName || !phone || !email) {
      setError(isBg ? "Моля попълнете всички задължителни полета." : "Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const year = new Date().getFullYear();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setGeneratedNo(`ALMI-B2B-${year}-${randomNum}`);
      setSuccess(true);
    } catch (err) {
      setError(isBg ? "Възникна грешка при обработката. Моля опитайте пак." : "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.nav.forBusinesses}</li>
          </ol>
        </nav>

        {/* Hero split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {isBg ? "Стабилна компютърна поддръжка за Вашия бизнес" : "Stable Computer Support for Your Business"}
            </h1>
            <p className="text-slate-350 text-base leading-relaxed">
              {isBg
                ? "Алми Груп ООД е Вашият надежден технологичен партньор в София. Ние помагаме на малки и средни фирми, офиси, магазини и кантори да поддържат техниката си изправна, да предпазят данните си от загуба и да осигурят непрекъснатост на бизнес процесите."
                : "Almi Group LTD is your reliable technology partner in Sofia. We help small and medium offices, shops, and consultancies keep their hardware running, protect operation data, and prevent workflow downtime."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-bold text-white flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{isBg ? "Превантивен мониторинг" : "Preventative Monitoring"}</span>
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  {isBg ? "Следим за софтуерни актуализации и бавна работа на дисковете, за да предвидим авариите." : "We monitor software status and hard drive integrity to predict and prevent failures."}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{isBg ? "Сигурност на данните" : "Data Cybersecurity"}</span>
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  {isBg ? "Настройваме надеждни защитни стени и антивирусен софтуер за блокиране на заплахи." : "We configure solid firewalls and anti-malware packages to block intrusions."}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{isBg ? "Локални и облачни архиви" : "Local & Cloud Backups"}</span>
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  {isBg ? "Архивираме счетоводни бази автоматично без прекъсване на ежедневния Ви работен процес." : "We back up accounting databases automatically without halting your daily workflows."}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{isBg ? "Регистър на устройствата" : "IT Asset Registry"}</span>
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  {isBg ? "Поддържаме пълен технически профил и одит история за всяка Ваша офис компютърна конфигурация." : "We maintain complete hardware specs and logs for every office configuration."}
                </p>
              </div>
            </div>
          </div>

          {/* Form container */}
          <div className="bg-[#12263F] border border-slate-800 p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">
              {isBg ? "Поискайте оферта за фирмена поддръжка" : "Request a Business Support Proposal"}
            </h2>
            <p className="text-xs text-slate-450 mb-6 leading-relaxed">
              {isBg
                ? "Попълнете детайлите за Вашия офис и ние ще подготвим индивидуално техническо и ценово предложение."
                : "Submit details about your office setup and we will prepare a customized technical proposal."}
            </p>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white">
                  {isBg ? "Запитването е изпратено!" : "Inquiry Submitted!"}
                </h3>
                <p className="text-xs text-slate-350 leading-relaxed">
                  {isBg
                    ? `Вашето запитване е заведено с регистрационен номер ${generatedNo}. Наш специалист ще се свърже с Вас за провеждане на консултация.`
                    : `Your inquiry has been logged under ID ${generatedNo}. Our tech team will contact you shortly to schedule an audit.`}
                </p>
                <Link
                  href="/paketi"
                  className="inline-block bg-slate-900 border border-slate-750 text-slate-300 px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  {isBg ? "Преглед на пакети" : "View Packages"}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{t.forms.fullName} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t.forms.placeholders.fullName}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.companyName} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t.forms.placeholders.companyName}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.email} *</label>
                    <input
                      type="email"
                      required
                      placeholder={t.forms.placeholders.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.phone} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t.forms.placeholders.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    {isBg ? "Брой компютри в офиса:" : "Number of computers in office:"}
                  </label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="1-5">1 - 5 {isBg ? "компютъра" : "computers"}</option>
                    <option value="6-15">6 - 15 {isBg ? "компютъра" : "computers"}</option>
                    <option value="16-30">16 - 30 {isBg ? "компютъра" : "computers"}</option>
                    <option value="31+">30+ {isBg ? "компютъра" : "computers"}</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={networkNeeded}
                      onChange={(e) => setNetworkNeeded(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Мрежа и Wi-Fi" : "Networks & Wi-Fi"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backupNeeded}
                      onChange={(e) => setBackupNeeded(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Архивиране" : "Data Backups"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityNeeded}
                      onChange={(e) => setSecurityNeeded(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Киберсигурност" : "Cybersecurity"}</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{isBg ? "Конкретни нужди / Коментар" : "Specific needs / Comment"}</label>
                  <textarea
                    rows={3}
                    placeholder={isBg ? "Опишете накратко каква поддръжка търсите..." : "Briefly describe the support you seek..."}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-3 rounded border border-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50"
                >
                  {submitting ? t.forms.submitting : t.forms.submit}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
