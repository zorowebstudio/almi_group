import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { Scale, AlertTriangle } from "lucide-react";

export default async function TermsAndConditionsPage() {
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
            <li className="text-slate-350">{t.legal.termsTitle}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.legal.termsTitle}
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
              ? "Тези Общи условия уреждат отношенията между Алми Груп ООД и потребителите на нашите компютърни и мрежови услуги в град София."
              : "These Terms and Conditions govern the relations between Almi Group LTD and users of our computer and network support services in Sofia."}
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Scale className="h-5 w-5 text-cyan-400" />
              <span>1. {isBg ? "Предоставяне на услуги" : "Provision of Services"}</span>
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed">
              {isBg
                ? "Алми Груп ООД извършва услуги съгласно техническите изисквания на сключените индивидуални договори или приемо-предавателните протоколи. Всички технически интервенции, ремонти и софтуерни преинсталации се съгласуват предварително с клиента въз основа на извършена диагностика."
                : "Almi Group LTD delivers support services in accordance with specific requirements in signed contracts or technical drop-off protocols. All hardware repairs and software modifications are validated in advance with the user following diagnostics."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Scale className="h-5 w-5 text-cyan-400" />
              <span>2. {isBg ? "Цени и плащания" : "Pricing & Payments"}</span>
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed">
              {isBg
                ? "Всички цени са индивидуални и се посочват в търговски оферти (quotes), изпратени до клиента през портала. Клиентът има право да приеме или откаже офертата. Дейности по поръчката се започват само след писмено или дигитално потвърждение на офертата."
                : "All prices are calculated individually and logged in custom offers (quotes) sent to the client via the portal. The client has the right to accept or decline the quote. Repair work is initiated only after written or digital confirmation."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Scale className="h-5 w-5 text-cyan-400" />
              <span>3. {isBg ? "Защита и Лицензиране" : "Security & Licensing"}</span>
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed">
              {isBg
                ? "Клиентът носи отговорност за осигуряването на оригинални софтуерни лицензи за операционни системи и програми, които изисква да бъдат инсталирани. Алми Груп ООД не носи отговорност за загуба на данни, ако клиентът не е направил архивно копие преди началото на ремонта."
                : "The client is solely responsible for supplying original, licensed software keys for operating systems and programs they request us to install. Almi Group LTD is not responsible for any data loss if the client has not performed a full backup prior to the tech intervention."}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
