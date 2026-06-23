import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { Server, Laptop, Wifi, Code, HelpCircle, HardDrive, ArrowRight } from "lucide-react";

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  const serviceKeys = Object.keys(t.services.items) as Array<keyof typeof t.services.items>;

  const getServiceIcon = (key: string) => {
    switch (key) {
      case "it-poddrazhka-za-firmi":
        return <Server className="h-8 w-8 text-cyan-400" />;
      case "remont-na-kompyutri":
        return <Laptop className="h-8 w-8 text-cyan-400" />;
      case "mrezhi-i-internet":
        return <Wifi className="h-8 w-8 text-cyan-400" />;
      case "softuerna-pomosht":
        return <Code className="h-8 w-8 text-cyan-400" />;
      case "distancionna-pomosht":
        return <HelpCircle className="h-8 w-8 text-cyan-400" />;
      case "arhivirane-i-zashtita":
        return <HardDrive className="h-8 w-8 text-cyan-400" />;
      default:
        return <Laptop className="h-8 w-8 text-cyan-400" />;
    }
  };

  return (
    <div className="py-24 bg-[#07111F]">
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
            <li className="text-slate-350">{t.nav.services}</li>
          </ol>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            {t.services.title}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceKeys.map((key) => {
            const service = t.services.items[key];
            const isB2B = key === "it-poddrazhka-za-firmi" || key === "arhivirane-i-zashtita";
            
            return (
              <div
                key={key}
                className="bg-[#12263F] border border-slate-800 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-all">
                    {getServiceIcon(key)}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    {service.desc}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {service.details}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-slate-450 uppercase">
                    {t.services.suitableFor} {isB2B ? t.services.business : t.services.private}
                  </span>
                  <Link
                    href={`/uslugi/${key}`}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors"
                  >
                    <span>{t.services.ctaDetails}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
