"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { MapPin, Clock, Phone, Copy, Check, CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function ContactPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Address copy state
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("гр. София, ул. Цар Симеон 20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) {
      setError(isBg ? "Моля попълнете всички задължителни полета." : "Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMsg("");
    } catch (err) {
      setError(isBg ? "Възникна грешка при изпращането. Моля опитайте пак." : "An error occurred. Please try again.");
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
            <li className="text-slate-350">{t.nav.contacts}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.nav.contacts}
          </h1>
          <p className="text-lg text-slate-400">
            {isBg
              ? "Свържете се с нас за диагностика, ремонт на компютри или фирмена ИТ консултация в София."
              : "Get in touch for diagnostics, computer repairs, or custom B2B IT support audits in Sofia."}
          </p>
        </div>

        {/* Core splits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Card & Map info */}
          <div className="space-y-8">
            <div className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl space-y-6 shadow-md">
              <h2 className="text-lg font-bold text-white mb-4">
                {isBg ? "Детайли за контакт" : "Contact Details"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{isBg ? "Адрес:" : "Address:"}</h4>
                    <p className="text-sm text-slate-300">
                      {isBg ? "гр. София, ул. „Цар Симеон“ 20" : "Sofia, Tsar Simeon St. 20"}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="mt-1 flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 focus:outline-none"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>{isBg ? "Копирано!" : "Copied!"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{isBg ? "Копирай адреса" : "Copy Address"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{isBg ? "Работно време:" : "Business Hours:"}</h4>
                    <p className="text-sm text-slate-300">
                      {isBg ? "Понеделник - Петък: 09:00 - 18:00" : "Monday - Friday: 09:00 - 18:00"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{isBg ? "Телефон за връзка:" : "Phone Line:"}</h4>
                    <a href={`tel:${t.nav.phone}`} className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                      {t.nav.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{isBg ? "Електронна поща:" : "Email Address:"}</h4>
                    <span className="text-sm text-slate-300">office@almi.bg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="w-full h-80 rounded-2xl bg-slate-900 border border-slate-800/80 overflow-hidden relative group">
              <iframe
                title="Google Map Sofia Tsar Simeon 20 Detail"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.2223847240375!2d23.323533815303644!3d42.70014297917822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa85721248003f%3A0xe54bb3f78e0ea5ad!2z0YPQuy4g0KbQsNGAINCh0LjQvNC10L7QvCAyMCwgMTAwMCDQodC-0YTQuNGP!5e0!3m2!1sbg!2sbg!4v1680000000000!5m2!1sbg!2sbg"
                className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 right-4">
                <a
                  href="https://maps.google.com/?q=София,+ул.+Цар+Симеон+20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#12263F] border border-slate-750 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-md"
                >
                  🗺️ {isBg ? "Навигирай с Google Карти" : "Get Directions"}
                </a>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">
              {isBg ? "Изпратете запитване" : "Send us a message"}
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {isBg 
                ? "Попълнете формата и наш сътрудник ще се свърже с Вас за отговор на Вашите въпроси."
                : "Fill out the contact form below and a representative will respond to your queries shortly."}
            </p>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white">
                  {isBg ? "Благодарим Ви!" : "Thank You!"}
                </h3>
                <p className="text-xs text-slate-350 leading-relaxed">
                  {isBg
                    ? "Вашето съобщение е изпратено успешно. Ще се свържем с Вас при първа възможност."
                    : "Your message has been processed successfully. We will get back to you as soon as possible."}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-slate-900 border border-slate-750 text-slate-300 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  {isBg ? "Изпрати ново запитване" : "Send new message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{t.forms.fullName} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t.forms.placeholders.fullName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
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
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.phone}</label>
                    <input
                      type="text"
                      placeholder={t.forms.placeholders.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">{t.forms.description} *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder={isBg ? "Напишете Вашето съобщение тук..." : "Write your message details here..."}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
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
