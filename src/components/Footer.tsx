"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { translations } from "@/lib/translations";
import { Cpu, Phone, MapPin, Mail, ShieldAlert } from "lucide-react";

export function Footer() {
  const { locale, setLanguage } = useLocale();
  const t = translations[locale];
  const currentYear = new Date().getFullYear();

  const serviceKeys = Object.keys(t.services.items) as Array<keyof typeof t.services.items>;

  return (
    <footer className="bg-[#07111F] border-t border-slate-800/80 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Corporate Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Алми Груп
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {locale === "bg" 
                ? "Професионална компютърна поддръжка, системна администрация, мрежова диагностика и ИТ сигурност за Вашия дом и бизнес."
                : "Professional computer support, system administration, network diagnostics and IT security for your home and business."
              }
            </p>
            <p className="text-xs text-slate-500">
              © {currentYear} Алми Груп ООД. {locale === "bg" ? "Всички права запазени." : "All rights reserved."}
            </p>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t.nav.services}
            </h3>
            <ul className="space-y-2 text-sm">
              {serviceKeys.map((key) => (
                <li key={key}>
                  <Link href={`/uslugi/${key}`} className="hover:text-cyan-400 transition-colors">
                    {t.services.items[key].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Actions */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {locale === "bg" ? "Помощ и Контакт" : "Help & Support"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/zayavi-pomosht" className="hover:text-cyan-400 transition-colors font-semibold text-slate-350">
                  {t.nav.requestHelp}
                </Link>
              </li>
              <li>
                <Link href="/proveri-zayavka" className="hover:text-cyan-400 transition-colors">
                  {t.nav.checkTicket}
                </Link>
              </li>
              <li>
                <Link href="/rezervaciya" className="hover:text-cyan-400 transition-colors">
                  {t.nav.booking}
                </Link>
              </li>
              <li>
                <Link href="/diagnostika" className="hover:text-cyan-400 transition-colors">
                  {t.nav.diagnostics}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  FAQ / {locale === "bg" ? "Въпроси" : "Questions"}
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-cyan-400 transition-colors">
                  {t.nav.helpCenter}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              {locale === "bg" ? "Контакти" : "Contacts"}
            </h3>
            <div className="space-y-3 text-sm">
              <a href={`tel:${t.nav.phone}`} className="flex items-center space-x-2 hover:text-cyan-400 transition-colors">
                <Phone className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>{t.nav.phone}</span>
              </a>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{locale === "bg" ? "София, ул. „Цар Симеон“ 20" : "Sofia, Tsar Simeon St. 20"}</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800/40">
                <ShieldAlert className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span>
                  {locale === "bg"
                    ? "Рейтинг: 5.0 базиран на 2 публични Google отзива."
                    : "Rating: 5.0 based on 2 public Google reviews."}
                </span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {locale === "bg" ? "Език / Language" : "Language"}
              </span>
              <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setLanguage("bg")}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    locale === "bg" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  Български
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    locale === "en" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Links */}
        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link href="/politika-za-poveritelnost" className="hover:text-slate-400 transition-colors">
              {t.legal.privacyTitle}
            </Link>
            <Link href="/politika-za-biskvitki" className="hover:text-slate-400 transition-colors">
              {t.legal.cookieTitle}
            </Link>
            <Link href="/obshti-usloviya" className="hover:text-slate-400 transition-colors">
              {t.legal.termsTitle}
            </Link>
          </div>
          <div>
            <span>{locale === "bg" ? "Алми Груп ООД - Вашият надежден IT партньор за офиса и дома." : "Almi Group LTD - Your reliable IT partner for office and home."}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
