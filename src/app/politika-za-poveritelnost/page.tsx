import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export default async function PrivacyPolicyPage() {
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
            <li className="text-slate-350">{t.legal.privacyTitle}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.legal.privacyTitle}
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

        {/* Legal Document Content */}
        <div className="bg-[#12263F] border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span>1. {isBg ? "Събиране на лични данни" : "Collection of Personal Data"}</span>
            </h2>
            <p>
              {isBg
                ? "Алми Груп ООД събира лични данни (като имена, имейл адреси, телефонни номера и технически подробности за устройствата) единствено с цел предоставяне на заявените компютърни услуги, диагностика, техническа помощ и управление на клиентски акаунти съгласно Регламент (ЕС) 2016/679 (GDPR)."
                : "Almi Group LTD collects personal details (such as names, email addresses, phone numbers, and technical hardware specifications) solely to deliver requested computer services, diagnostics, helpdesk tasks, and manage customer portal accounts in accordance with GDPR regulations."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span>2. {isBg ? "Цели на обработването" : "Purposes of Data Processing"}</span>
            </h2>
            <p>
              {isBg
                ? "Данните се обработват за: \n• Идентифициране на клиента при залагане на тикети;\n• Насрочване на часове за посещения на място в София;\n• Изпращане на официални търговски оферти и протоколи;\n• Комуникация по технически казуси между техници и клиенти."
                : "Data is processed to: \n• Identify clients upon ticket creation;\n• Schedule dates for on-site tech appointments in Sofia;\n• Dispatch official IT proposals, invoices, and service protocols;\n• Facilitate secure communications between technicians and users."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span>3. {isBg ? "Съхранение на данните" : "Data Retention"}</span>
            </h2>
            <p>
              {isBg
                ? "Данните се съхраняват в защитени локални бази данни и не се споделят с трети страни за маркетингови цели. Личните данни се изтриват след приключване на срока на договора или по изрично писмено искане от субекта на данните."
                : "We store data securely in local database tables and never share details with third-party providers for marketing purposes. Personal information is deleted upon contract termination or upon formal user request."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span>4. {isBg ? "Вашите права" : "Your Rights"}</span>
            </h2>
            <p>
              {isBg
                ? "Вие имате право на достъп, коригиране, ограничаване на обработката, изтриване (правото 'да бъдеш забравен') и преносимост на Вашите лични данни. За целта се свържете с отговорното лице на имейл office@almi.bg."
                : "You possess the right to access, rectify, restrict processing, delete (the right 'to be forgotten'), and request portability of your details. Contact our data officer at office@almi.bg to exercise these rights."}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
