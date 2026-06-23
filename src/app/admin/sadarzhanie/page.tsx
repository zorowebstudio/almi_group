import { prisma } from "@/lib/db";
import { createFAQ, createKnowledgeArticle } from "@/app/portal/actions";
import { BookOpen, HelpCircle, PlusCircle, Globe, ChevronRight } from "lucide-react";
import Link from "next/link";

interface AdminContentProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminContent({ searchParams }: AdminContentProps) {
  const { tab = "faq" } = await searchParams;

  const [faqs, articles] = await Promise.all([
    prisma.fAQItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.knowledgeArticle.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6 text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <span>Управление на Съдържанието</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Публикувайте нови Често Задавани Въпроси (FAQ) и полезни статии в Помощния Център.
          </p>
        </div>

        {/* Tab selection links */}
        <div className="flex items-center bg-[#0D1F35] border border-slate-800 rounded-lg p-1 space-x-1">
          <Link
            href="/admin/sadarzhanie?tab=faq"
            className={`px-4 py-2 rounded-md font-bold transition-all ${
              tab === "faq" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Въпроси (FAQ)
          </Link>
          <Link
            href="/admin/sadarzhanie?tab=articles"
            className={`px-4 py-2 rounded-md font-bold transition-all ${
              tab === "articles" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Статии (Help)
          </Link>
        </div>
      </div>

      {tab === "faq" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-blue-400" />
                <span>Налични Въпроси ({faqs.length})</span>
              </h2>

              <div className="divide-y divide-slate-850 max-h-[500px] overflow-y-auto pr-1">
                {faqs.map((faq) => (
                  <div key={faq.id} className="py-3.5 space-y-2 hover:bg-[#12263F]/15 px-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono text-[9px]">
                        {faq.category}
                      </span>
                    </div>
                    <p className="font-extrabold text-white">BG: {faq.questionBg}</p>
                    <p className="text-slate-400">BG Отговор: {faq.answerBg.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Creator Form */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Нов Въпрос (FAQ)</h3>
            <form action={async (formData: FormData) => {
              "use server";
              const category = formData.get("category") as string;
              const questionBg = formData.get("questionBg") as string;
              const questionEn = formData.get("questionEn") as string;
              const answerBg = formData.get("answerBg") as string;
              const answerEn = formData.get("answerEn") as string;
              await createFAQ({ category, questionBg, questionEn, answerBg, answerEn });
            }} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Категория</label>
                <select
                  name="category"
                  required
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white font-semibold"
                >
                  <option value="GENERAL">GENERAL (Общи)</option>
                  <option value="TICKETS">TICKETS (Заявки)</option>
                  <option value="REPAIRS">REPAIRS (Ремонти)</option>
                  <option value="REMOTE">REMOTE (Дистанционно)</option>
                  <option value="BUSINESS">BUSINESS (Бизнес)</option>
                  <option value="BOOKINGS">BOOKINGS (Резервации)</option>
                  <option value="SECURITY">SECURITY (Сигурност)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Въпрос (Български)</label>
                <input
                  type="text"
                  name="questionBg"
                  required
                  placeholder="напр. Как да заявя ремонт?"
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Въпрос (English)</label>
                <input
                  type="text"
                  name="questionEn"
                  required
                  placeholder="e.g. How do I request a repair?"
                  className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Отговор (Български)</label>
                <textarea
                  name="answerBg"
                  rows={3}
                  required
                  placeholder="Въведете обяснителен текст на български..."
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Отговор (English)</label>
                <textarea
                  name="answerEn"
                  rows={3}
                  required
                  placeholder="Enter explanation in English..."
                  className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2.5 rounded-lg shadow transition-all cursor-pointer"
              >
                Публикувай FAQ
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Articles List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <BookOpen className="h-4.5 w-4.5 text-blue-400" />
                <span>Публикувани статии ({articles.length})</span>
              </h2>

              <div className="divide-y divide-slate-850 max-h-[500px] overflow-y-auto pr-1">
                {articles.map((art) => (
                  <div key={art.id} className="py-3.5 space-y-1 hover:bg-[#12263F]/15 px-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-cyan-400 font-bold">{art.slug}</span>
                      <span className="text-slate-500">Четене: {art.readingTime} мин</span>
                    </div>
                    <p className="font-extrabold text-white">BG: {art.titleBg}</p>
                    <p className="text-slate-500 font-mono text-[9px] uppercase">Категория: {art.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Article Creator Form */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Нова Статия</h3>
            <form action={async (formData: FormData) => {
              "use server";
              const category = formData.get("category") as string;
              const slug = formData.get("slug") as string;
              const titleBg = formData.get("titleBg") as string;
              const titleEn = formData.get("titleEn") as string;
              const contentBg = formData.get("contentBg") as string;
              const contentEn = formData.get("contentEn") as string;
              await createKnowledgeArticle({ category, slug, titleBg, titleEn, contentBg, contentEn });
            }} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Категория</label>
                <select
                  name="category"
                  required
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white font-semibold"
                >
                  <option value="COMPUTERS">COMPUTERS (Компютри)</option>
                  <option value="WINDOWS">WINDOWS (ОС Windows)</option>
                  <option value="NETWORK">NETWORK (Мрежи)</option>
                  <option value="PRINTERS">PRINTERS (Принтери)</option>
                  <option value="SOFTWARE">SOFTWARE (Софтуер)</option>
                  <option value="EMAIL">EMAIL (Електронна поща)</option>
                  <option value="BACKUP">BACKUP (Архивиране)</option>
                  <option value="SECURITY">SECURITY (Киберсигурност)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Slug (Уникален адрес)</label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="напр. kak-da-smenya-wi-fi-parola"
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Заглавие (Български)</label>
                <input
                  type="text"
                  name="titleBg"
                  required
                  placeholder="напр. Как да сменим Wi-Fi парола"
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Заглавие (English)</label>
                <input
                  type="text"
                  name="titleEn"
                  required
                  placeholder="e.g. How to change Wi-Fi password"
                  className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Съдържание (Български)</label>
                <textarea
                  name="contentBg"
                  rows={4}
                  required
                  placeholder="Напишете статията..."
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Съдържание (English)</label>
                <textarea
                  name="contentEn"
                  rows={4}
                  required
                  placeholder="Write in English..."
                  className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2.5 rounded-lg shadow transition-all cursor-pointer"
              >
                Публикувай статията
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
