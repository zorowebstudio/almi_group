import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { Cpu, Phone, MapPin, Star, ShieldCheck, ArrowRight } from "lucide-react";

export default async function AboutUsPage() {
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
            <li className="text-slate-350">{t.nav.aboutUs}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.nav.aboutUs}
          </h1>
          <p className="text-lg text-cyan-400 font-bold">
            {isBg ? "„Вашият надежден IT партньор за офиса и дома.“" : '"Your reliable IT partner for office and home."'}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#12263F] border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl space-y-8">
          
          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            <p>
              {isBg
                ? "Алми Груп ООД е ИТ компания, специализирана в компютърната поддръжка, администрацията на мрежови конфигурации, диагностиката на повреди и софтуерната помощ за корпоративни и частни клиенти в град София."
                : "Almi Group LTD is an IT support provider specializing in computer repairs, network administration, hardware diagnostics, and software configurations for businesses and private clients in Sofia."}
            </p>
            <p>
              {isBg
                ? "Ние се позиционираме като надежден партньор за малки и средни офиси, магазини, кантори и организации, които изискват стабилно работеща техническа инфраструктура, за да предотвратят спиране на работните процеси. Същевременно предлагаме професионални сервизни услуги и диагностика на компютри и лаптопи и за домашни потребители."
                : "We position ourselves as a reliable technology partner for small and medium-sized offices, shops, and professional service firms that require a stable infrastructure to avoid business downtime. At the same time, we provide repair services and computer diagnostics to private home clients."}
            </p>
            <p>
              {isBg
                ? "Вярваме, че прозрачността е ключът към успешното сътрудничество. Нашите технически протоколи, оферти и проследяването на статуса на ремонта се управляват изцяло онлайн чрез нашия клиентски портал, което осигурява на клиентите ясна проследимост на всяка стъпка."
                : "We believe transparency is key to successful pair-working. Our technical protocols, offers, and ticket status timeline updates are managed online through our customer portal, giving clients clear insights at every step."}
            </p>
          </div>

          {/* Business Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-800/80">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                {isBg ? "Официална информация за фирмата:" : "Official Business Details:"}
              </h3>
              <div className="space-y-3 text-sm text-slate-450">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>Алми Груп ООД</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{isBg ? "гр. София, ул. „Цар Симеон“ 20" : "Sofia, Tsar Simeon St. 20"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{t.nav.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                {isBg ? "Рейтинг и отзиви:" : "Ratings & Reviews:"}
              </h3>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="font-extrabold text-white">5.0 / 5.0</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed">
                  {isBg
                    ? "Рейтингът ни в Google Maps е 5.0, базиран на 2 публични реални Google отзива на клиенти в София."
                    : "Our rating on Google Maps is 5.0, based on 2 public Google reviews from verified local clients in Sofia."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center space-y-4">
          <Link
            href="/zayavi-pomosht"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10"
          >
            <span>{t.nav.requestHelp}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
