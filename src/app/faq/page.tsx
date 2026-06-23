"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { ChevronDown, Search, ArrowRight, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Categories list
  const categories = [
    { key: "ALL", label: isBg ? "Всички" : "All" },
    ...Object.keys(t.faq.categories).map((k) => ({
      key: k,
      label: t.faq.categories[k as keyof typeof t.faq.categories],
    })),
  ];

  // Map category code to translations
  const faqItems = t.faq.items;

  // Filter logic
  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.cat === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Construct JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  return (
    <>
      {/* Inject FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

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
              <li className="text-slate-350">{t.faq.title}</li>
            </ol>
          </nav>

          <div className="text-center mb-12 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.faq.title}
            </h1>
            <p className="text-slate-400">
              {t.faq.subtitle}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder={t.faq.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12263F] border border-slate-800 p-4 pl-12 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  selectedCategory === cat.key
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-[#12263F]/50 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 min-h-[250px]">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                
                return (
                  <div
                    key={idx}
                    className="bg-[#12263F] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                          isOpen ? "rotate-180 text-cyan-400" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Collapsible Area */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-80 opacity-100 border-t border-slate-800/80" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="p-6 text-sm text-slate-350 leading-relaxed bg-[#1b3252]/10">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-[#12263F]/40 border border-slate-850 rounded-2xl">
                <p className="text-slate-400 text-sm">
                  {t.faq.noResults}
                </p>
              </div>
            )}
          </div>

          {/* Bottom CTAs */}
          <div className="mt-16 bg-gradient-to-tr from-[#0D1F35] to-[#12263F] border border-slate-800 p-8 rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/25 rounded-full flex items-center justify-center text-cyan-400 mx-auto">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isBg ? "Не намерихте Вашия въпрос?" : "Still have questions?"}
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              {isBg
                ? "Изпратете ни заявка за помощ или се свържете директно по телефона. Нашите техници ще разгледат техническия Ви казус."
                : "Submit a support request directly or reach us on our hotline. Our support desk is ready to inspect your specific technical case."}
            </p>
            <div className="flex justify-center space-x-4 pt-2">
              <Link
                href="/zayavi-pomosht"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10"
              >
                {t.nav.requestHelp}
              </Link>
              <Link
                href="/kontakti"
                className="bg-slate-900 border border-slate-750 hover:bg-slate-800 text-slate-300 px-5 py-2.5 rounded-lg text-xs font-bold transition-all"
              >
                {t.nav.contacts}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
