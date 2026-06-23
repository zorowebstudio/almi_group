import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { prisma } from "@/lib/db";
import { Search, Clock, ArrowRight, Laptop, HelpCircle } from "lucide-react";

interface HelpPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function HelpCenterPage({ searchParams }: HelpPageProps) {
  const locale = await getLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  const { q: query, cat: category } = await searchParams;

  // 1. Fetch articles from DB based on parameters
  const whereClause: any = { isPublished: true };
  if (category && category !== "ALL") {
    whereClause.category = category;
  }
  
  if (query) {
    whereClause.OR = [
      { titleBg: { contains: query } },
      { titleEn: { contains: query } },
      { contentBg: { contains: query } },
      { contentEn: { contains: query } },
    ];
  }

  const articles = await prisma.knowledgeArticle.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  // Categories list
  const categoriesList = [
    { key: "ALL", label: isBg ? "Всички" : "All" },
    ...Object.keys(t.help.categories).map((k) => ({
      key: k,
      label: t.help.categories[k as keyof typeof t.help.categories],
    })),
  ];

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.nav.helpCenter}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.help.title}
          </h1>
          <p className="text-slate-400">
            {t.help.subtitle}
          </p>
        </div>

        {/* Search form (performs GET request to refresh server component with search params) */}
        <form method="GET" action="/help" className="relative mb-8 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            name="q"
            defaultValue={query || ""}
            placeholder={t.help.searchPlaceholder}
            className="w-full bg-[#12263F] border border-slate-800 p-4 pl-12 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          {category && <input type="hidden" name="cat" value={category} />}
        </form>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categoriesList.map((cat) => {
            const isActive = (!category && cat.key === "ALL") || category === cat.key;
            
            // Build target URL
            const url = new URL("/help", "http://localhost:3000"); // domain doesn't matter for path building
            if (cat.key !== "ALL") url.searchParams.set("cat", cat.key);
            if (query) url.searchParams.set("q", query);

            return (
              <Link
                key={cat.key}
                href={`${url.pathname}${url.search}`}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-[#12263F]/50 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
          {articles.length > 0 ? (
            articles.map((art) => {
              const title = isBg ? art.titleBg : art.titleEn;
              const snippet = isBg ? art.contentBg : art.contentEn;
              const catLabel = t.help.categories[art.category as keyof typeof t.help.categories];
              
              return (
                <div
                  key={art.id}
                  className="bg-[#12263F] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-cyan-400 uppercase tracking-wider bg-cyan-400/5 px-2.5 py-0.5 rounded">
                        {catLabel}
                      </span>
                      <span className="flex items-center space-x-1 text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{art.readingTime} {t.help.readTime}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {snippet}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-slate-800/80">
                    <Link
                      href={`/help/${art.slug}`}
                      className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors"
                    >
                      <span>{isBg ? "Прочети статията" : "Read Article"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-16 bg-[#12263F]/40 border border-slate-850 rounded-2xl space-y-2">
              <p className="text-slate-400 text-sm">{t.help.noArticles}</p>
              {query && (
                <Link href="/help" className="text-xs text-cyan-400 hover:underline">
                  {isBg ? "Изчисти филтрите" : "Clear Search"}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Support Intake CTA Card */}
        <div className="mt-16 bg-gradient-to-tr from-[#0D1F35] to-[#12263F] border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/25 rounded-full flex items-center justify-center text-cyan-400 mx-auto">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {t.help.needMoreHelp}
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            {t.help.createTicketCTA}
          </p>
          <div className="pt-2">
            <Link
              href="/zayavi-pomosht"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10 inline-block"
            >
              {t.help.createTicketBtn}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
