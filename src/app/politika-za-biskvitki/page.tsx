import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { Info, AlertTriangle } from "lucide-react";

export default async function CookiePolicyPage() {
  const locale = await getLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.legal.cookieTitle}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.legal.cookieTitle}
          </h1>
        </div>

        {/* Legal Warning Notice */}
        <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-2xl mb-10 flex items-start space-x-3 text-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-slate-300 space-y-1">
            <p className="font-bold text-white">
              {isBg ? "Декларация за демо характер на съдържанието" : "Demo Content Disclaimer"}
            </p>
            <p className="text-xs">
              {t.legal.reviewNotice}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#12263F] border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            {isBg
              ? "Уебсайтът на Алми Груп ООД използва бисквитки (cookies), за да подобри функционалността на Вашето сърфиране, да запомни езиковите Ви предпочитания и да гарантира сигурността на сесиите в портала."
              : "Almi Group LTD's website utilizes cookies to improve navigation speed, memorize your language preferences, and secure portal sessions."}
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">
              1. {isBg ? "Задължителни бисквитки (Essential Cookies)" : "Essential Cookies"}
            </h2>
            <p className="text-xs text-slate-450">
              {isBg
                ? "Тези бисквитки са критично необходими за функционирането на сайта и не могат да бъдат изключени. Например:\n• almi_session - Пази сесията за вход в портала (изтрива се след 7 дни);\n• almi_locale - Пази избора Ви за език (Български или Английски);\n• almi_theme - Пази предпочитанието Ви за светла или тъмна тема."
                : "These cookies are strictly required to navigate the site and cannot be disabled in our systems. For example:\n• almi_session - Encrypted token securing portal logins (expires in 7 days);\n• almi_locale - Memorizes language selection (Bulgarian or English);\n• almi_theme - Retains visual mode preference (Light or Dark theme)."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">
              2. {isBg ? "Статистически бисквитки (Analytics Cookies)" : "Analytics Cookies"}
            </h2>
            <p className="text-xs text-slate-450">
              {isBg
                ? "Позволяват ни да отчитаме посещенията и източниците на трафик, за да измерим и подобрим производителността на нашия сайт. Ние не събираме данни, които могат да Ви идентифицират лично."
                : "Allow us to count visits and traffic sources so we can measure and improve website response speeds. We do not load data that personally identifies you."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">
              3. {isBg ? "Управление на бисквитките" : "Managing Cookies"}
            </h2>
            <p className="text-xs text-slate-450">
              {isBg
                ? "Можете да промените настройките за съгласие за бисквитки по всяко време през нашия панел за поверителност (Cookie Consent Banner) в долната част на екрана или чрез настройките на Вашия браузър."
                : "You can modify your cookie consent settings at any time via the Privacy Banner floating at the bottom of the screen or directly inside your web browser configuration tabs."}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
