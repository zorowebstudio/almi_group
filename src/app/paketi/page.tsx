import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { Check, Info, Server, ShieldCheck, Zap } from "lucide-react";

export default async function PackagesPage() {
  const locale = await getLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  const plans = [
    {
      name: t.calculator.plans.basic,
      icon: <Zap className="h-6 w-6 text-blue-400" />,
      desc: t.calculator.planDetails.basic,
      features: [
        isBg ? "Дистанционна софтуерна помощ" : "Remote Software Assistance",
        isBg ? "Поддръжка до 5 офис компютъра" : "Support for up to 5 office PCs",
        isBg ? "Настройка на електронни пощи" : "Email account setups",
        isBg ? "Помощ при инсталиране на драйвери" : "Driver installation help",
        isBg ? "История на техническите случаи" : "Support ticket logging history"
      ],
      cta: t.calculator.cta
    },
    {
      name: t.calculator.plans.business,
      icon: <Server className="h-6 w-6 text-cyan-400" />,
      desc: t.calculator.planDetails.business,
      featured: true,
      features: [
        isBg ? "Всичко включено в Базовия план" : "Everything in Basic Plan",
        isBg ? "Поддръжка до 15 устройства" : "Support for up to 15 devices",
        isBg ? "Посещения на място в София при нужда" : "Sofia on-site technician visits",
        isBg ? "Поддръжка на офис мрежа и рутери" : "Office network & router support",
        isBg ? "Конфигуриране на мрежови принтери" : "Shared network printer configuration",
        isBg ? "Оптимизация на операционни системи" : "Operating system speed tuning"
      ],
      cta: t.calculator.cta
    },
    {
      name: t.calculator.plans.complete,
      icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
      desc: t.calculator.planDetails.complete,
      features: [
        isBg ? "Всичко включено в Бизнес плана" : "Everything in Business Plan",
        isBg ? "Поддръжка на над 15 устройства" : "Support for 15+ computers",
        isBg ? "Поддръжка на локални сървъри/NAS" : "Office servers / NAS array support",
        isBg ? "Автоматично архивиране на данни" : "Automated data backup routines",
        isBg ? "Консултации за ИТ сигурност" : "Cybersecurity auditing & counsel",
        isBg ? "Следене за смущения по мрежата" : "Proactive network monitoring checks"
      ],
      cta: t.calculator.cta
    }
  ];

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
            <li className="text-slate-350">{isBg ? "Абонаментни IT планове" : "Subscription IT Plans"}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isBg ? "Абонаментни планове за IT поддръжка" : "IT Support Subscription Plans"}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            {isBg 
              ? "Гъвкави технологични решения за малки фирми, офиси и магазини в София." 
              : "Flexible technical solutions for small offices, shops and organizations in Sofia."}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-2xl max-w-4xl mx-auto mb-12 flex items-start space-x-3 text-sm">
          <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-slate-300 space-y-2 leading-relaxed">
            <p className="font-bold text-white">
              {isBg ? "Всички цени са по индивидуално договаряне" : "All prices are subject to custom offers"}
            </p>
            <p className="text-xs">
              {isBg
                ? "Алми Груп ООД не използва изкуствени фиксирани цени. Окончателният обхват на поддръжката, SLA времената за реакция и стойността се дефинират в писмена индивидуална оферта след предварителен оглед на Вашите офис компютри и мрежа."
                : "Almi Group LTD does not display generalized flat pricing. The definitive support scope, SLA response times, and pricing are defined in writing within an individual quote following a physical review of your office setup."}
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-[#12263F] border rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                plan.featured 
                  ? "border-blue-500 shadow-xl shadow-blue-500/5 scale-[1.02] z-10" 
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.featured && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow">
                  {isBg ? "Най-популярен" : "Most Popular"}
                </span>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center">
                    {plan.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {plan.desc}
                </p>

                {/* Price tag (Demo placeholder) */}
                <div className="mb-6 py-4 border-y border-slate-800/80">
                  <span className="text-2xl font-extrabold text-cyan-400">
                    {isBg ? "Индивидуална оферта" : "Custom Quote"}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {isBg ? "След техническа консултация" : "Following technical consultation"}
                  </p>
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 leading-relaxed">
                      <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/firmi"
                className={`block text-center py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  plan.featured
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-900 border border-slate-750 hover:bg-slate-800 text-cyan-400"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
