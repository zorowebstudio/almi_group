"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Printer, Share2 } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import { translations } from "@/lib/translations";

export function ArticleFeedback() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFeedback = () => {
    setFeedbackGiven(true);
    // In production, we'd fire an API call to save feedback
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="border-y border-slate-800 py-6 my-10 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      {/* Article Feedback */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-semibold text-slate-300">
          {t.help.wasHelpful}
        </span>
        {feedbackGiven ? (
          <span className="text-xs font-bold text-cyan-400">
            ✓ {t.help.thanks}
          </span>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleFeedback}
              className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-700 text-xs text-slate-350 hover:text-white transition-colors"
            >
              <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t.help.yes}</span>
            </button>
            <button
              onClick={handleFeedback}
              className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-700 text-xs text-slate-350 hover:text-white transition-colors"
            >
              <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
              <span>{t.help.no}</span>
            </button>
          </div>
        )}
      </div>

      {/* Share / Print actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-750 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>{copied ? (isBg ? "Копирано!" : "Copied!") : (isBg ? "Сподели" : "Share")}</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-750 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>{isBg ? "Печат" : "Print"}</span>
        </button>
      </div>
    </div>
  );
}
