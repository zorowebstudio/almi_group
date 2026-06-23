export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { prisma } from "@/lib/db";
import { ArticleFeedback } from "@/components/ArticleFeedback";
import { Clock, Calendar, ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const isBg = locale === "bg";

  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug },
    });

    if (!article) return {};

    return {
      title: `${isBg ? article.titleBg : article.titleEn} | Алми Груп ООД`,
      description: isBg
        ? article.contentBg.slice(0, 150) + "..."
        : article.contentEn.slice(0, 150) + "...",
    };
  } catch {
    // Database unavailable during build — return minimal metadata gracefully
    return {};
  }
}

export default async function HelpArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  // Fetch article
  const article = await prisma.knowledgeArticle.findUnique({
    where: { slug, isPublished: true },
  });

  if (!article) {
    notFound();
  }

  // Fetch related articles (same category, excluding current one)
  const relatedArticles = await prisma.knowledgeArticle.findMany({
    where: {
      category: article.category,
      slug: { not: slug },
      isPublished: true,
    },
    take: 3,
  });

  const title = isBg ? article.titleBg : article.titleEn;
  const content = isBg ? article.contentBg : article.contentEn;
  const catLabel = t.help.categories[article.category as keyof typeof t.help.categories];
  const dateFormatted = new Date(article.updatedAt).toLocaleDateString(
    isBg ? "bg-BG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Construct JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": content.slice(0, 150) + "...",
    "category": article.category,
    "inLanguage": locale,
    "datePublished": article.createdAt.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Алми Груп ООД"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Алми Груп ООД",
      "logo": {
        "@type": "ImageObject",
        "url": "http://localhost:3000/favicon.ico" // Replace with actual production logo URL
      }
    }
  };

  return (
    <>
      {/* Inject Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="bg-[#07111F] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider print:hidden" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-slate-300 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/help" className="hover:text-slate-300 transition-colors">
                  {t.nav.helpCenter}
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-350 max-w-[250px] truncate">{title}</li>
            </ol>
          </nav>

          {/* Back Button */}
          <Link
            href="/help"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-8 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.help.back}</span>
          </Link>

          {/* Article Wrapper */}
          <article className="bg-[#12263F] border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6 print:border-none print:bg-transparent print:p-0 print:shadow-none">
            
            {/* Meta header */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-bold text-cyan-400 uppercase tracking-wider bg-cyan-400/5 px-2.5 py-0.5 rounded">
                {catLabel}
              </span>
              <span className="flex items-center space-x-1 text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readingTime} {t.help.readTime}</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t.help.updated}: {dateFormatted}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {title}
            </h1>

            {/* Divider */}
            <div className="h-px bg-slate-800/80 my-6" />

            {/* Article Content */}
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line prose prose-invert max-w-none">
              {content}
            </div>

            {/* Interactive Feedback & Print actions */}
            <ArticleFeedback />

          </article>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 print:hidden">
              <h2 className="text-xl font-bold text-white mb-6">
                {isBg ? "Други статии от тази категория:" : "Other articles in this category:"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/help/${rel.slug}`}
                    className="block bg-[#12263F] border border-slate-800 hover:border-slate-700 p-5 rounded-xl transition-colors group"
                  >
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {isBg ? rel.titleBg : rel.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2">
                      {rel.readingTime} {t.help.readTime}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
