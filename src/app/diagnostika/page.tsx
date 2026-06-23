"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { Cpu, ArrowLeft, ArrowRight, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DiagnosticsPage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";
  const router = useRouter();

  // Wizard state: "START" | "QUESTION" | "RESULT"
  const [wizardState, setWizardState] = useState<"START" | "QUESTION" | "RESULT">("START");
  const [currentNodeKey, setCurrentNodeKey] = useState<string>("deviceType");
  const [history, setHistory] = useState<string[]>([]);
  const [answersLog, setAnswersLog] = useState<{ q: string; a: string }[]>([]);
  const [resultKey, setResultKey] = useState<string>("");

  const handleStart = () => {
    setWizardState("QUESTION");
    setCurrentNodeKey("deviceType");
    setHistory([]);
    setAnswersLog([]);
    setResultKey("");
  };

  const handleAnswerSelect = (optionKey: string, optionLabel: string) => {
    const node = t.diagnostics.steps[currentNodeKey as keyof typeof t.diagnostics.steps];
    
    // Log current Q&A
    const currentLog = {
      q: node.q,
      a: optionLabel,
    };
    const newAnswersLog = [...answersLog, currentLog];
    setAnswersLog(newAnswersLog);
    setHistory([...history, currentNodeKey]);

    // Adaptive routing logic based on selected option
    if (currentNodeKey === "deviceType") {
      if (optionKey === "pc") {
        setCurrentNodeKey("pc_power");
      } else if (optionKey === "laptop") {
        setCurrentNodeKey("laptop_issues");
      } else if (optionKey === "internet") {
        setCurrentNodeKey("internet_issues");
      } else if (optionKey === "printer") {
        setCurrentNodeKey("printer_issues");
      } else if (optionKey === "security") {
        setCurrentNodeKey("security_issues");
      } else {
        // Other leads directly to result
        showResult("check_connections", newAnswersLog);
      }
    } 
    // PC flow routing
    else if (currentNodeKey === "pc_power") {
      if (optionKey === "yes") {
        setCurrentNodeKey("pc_screen_black");
      } else if (optionKey === "no") {
        setCurrentNodeKey("pc_no_power_check");
      } else {
        showResult("pc_hardware_fault", newAnswersLog); // Blue screen
      }
    } else if (currentNodeKey === "pc_screen_black") {
      if (optionKey === "yes") {
        showResult("pc_monitor_issue", newAnswersLog);
      } else {
        showResult("check_connections", newAnswersLog);
      }
    } else if (currentNodeKey === "pc_no_power_check") {
      if (optionKey === "yes") {
        showResult("pc_hardware_fault", newAnswersLog);
      } else {
        showResult("check_connections", newAnswersLog);
      }
    }
    // Laptop flow routing
    else if (currentNodeKey === "laptop_issues") {
      if (optionKey === "slow") {
        showResult("laptop_upgrade", newAnswersLog);
      } else if (optionKey === "hot") {
        showResult("laptop_dust", newAnswersLog);
      } else {
        showResult("pc_hardware_fault", newAnswersLog); // Battery
      }
    }
    // Internet flow routing
    else if (currentNodeKey === "internet_issues") {
      if (optionKey === "all") {
        setCurrentNodeKey("internet_all_check");
      } else {
        showResult("internet_device_settings", newAnswersLog);
      }
    } else if (currentNodeKey === "internet_all_check") {
      if (optionKey === "yes") {
        showResult("internet_isp", newAnswersLog);
      } else {
        showResult("check_connections", newAnswersLog);
      }
    }
    // Printer flow routing
    else if (currentNodeKey === "printer_issues") {
      if (optionKey === "error_msg") {
        showResult("pc_hardware_fault", newAnswersLog);
      } else {
        showResult("printer_driver", newAnswersLog);
      }
    }
    // Security flow routing
    else if (currentNodeKey === "security_issues") {
      if (optionKey === "phishing") {
        showResult("security_phishing", newAnswersLog);
      } else if (optionKey === "ransomware") {
        showResult("security_disconnect", newAnswersLog);
      } else {
        showResult("laptop_upgrade", newAnswersLog); // Popups adware
      }
    }
  };

  const handleBack = () => {
    if (history.length === 0) {
      setWizardState("START");
      return;
    }

    const previousNodeKey = history[history.length - 1];
    setCurrentNodeKey(previousNodeKey);
    setHistory(history.slice(0, -1));
    setAnswersLog(answersLog.slice(0, -1));
  };

  const showResult = (resKey: string, finalLog = answersLog) => {
    setResultKey(resKey);
    setWizardState("RESULT");
  };

  // Convert collected diagnostics into a ticket description and redirect
  const handleConvertToTicket = () => {
    const diagnosticSummary = answersLog
      .map((item, idx) => `${idx + 1}. В: ${item.q} \n   О: ${item.a}`)
      .join("\n");
      
    const resultObj = t.diagnostics.results[resultKey as keyof typeof t.diagnostics.results];
    const detailsText = `*** АВТОМАТИЧНА ДИГНОСТИКА ***\n` +
      `Предварителен резултат: ${resultObj?.title || ""}\n` +
      `Препоръка: ${resultObj?.rec || ""}\n\n` +
      `ДЕТАЙЛИ ОТ ДИАГНОСТИЧНИЯ ТЕСТ:\n${diagnosticSummary}`;

    // Pass data via url query string (encoded)
    const categoryQuery = currentNodeKey.startsWith("pc") ? "HARDWARE" : currentNodeKey.startsWith("internet") ? "NETWORK" : "SOFTWARE";
    const subjectQuery = `Заявка след диагностика: ${resultObj?.title || "IT проблем"}`;
    
    const url = new URL("/zayavi-pomosht", "http://localhost:3000");
    url.searchParams.set("subject", subjectQuery);
    url.searchParams.set("desc", detailsText);
    url.searchParams.set("cat", categoryQuery);

    router.push(`${url.pathname}${url.search}`);
  };

  const currentNode = t.diagnostics.steps[currentNodeKey as keyof typeof t.diagnostics.steps];
  const currentResult = t.diagnostics.results[resultKey as keyof typeof t.diagnostics.results];

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.nav.diagnostics}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.diagnostics.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.diagnostics.subtitle}
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="bg-[#12263F] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl min-h-[350px] flex flex-col justify-between">
          
          {/* START STATE */}
          {wizardState === "START" && (
            <div className="text-center space-y-8 my-auto">
              <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
                <Cpu className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">
                  {isBg ? "Бърза ИТ проверка в няколко стъпки" : "Fast IT troubleshooting in a few steps"}
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isBg
                    ? "Отговорете на кратките ни въпроси за Вашето устройство, за да локализираме възможния дефект и да Ви насочим към правилното решение."
                    : "Answer our short questions about your device parameters so we can narrow down the potential fault and guide you to a solution."}
                </p>
              </div>
              <button
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10"
              >
                {t.diagnostics.start}
              </button>
            </div>
          )}

          {/* QUESTION STATE */}
          {wizardState === "QUESTION" && currentNode && (
            <div className="space-y-8 flex flex-col justify-between h-full">
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${(history.length / 4) * 100}%` }}
                  />
                </div>
                
                {/* Question */}
                <h2 className="text-xl font-bold text-white leading-snug">
                  {currentNode.q}
                </h2>

                {/* Options list */}
                <div className="grid grid-cols-1 gap-3">
                  {Object.keys(currentNode.options).map((optKey) => {
                    const optLabel = currentNode.options[optKey as keyof typeof currentNode.options];
                    return (
                      <button
                        key={optKey}
                        onClick={() => handleAnswerSelect(optKey, optLabel)}
                        className="w-full text-left bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-[#1b3252]/20 p-4 rounded-xl text-xs sm:text-sm text-slate-200 transition-all font-semibold"
                      >
                        {optLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white transition-colors focus:outline-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t.diagnostics.prev}</span>
                </button>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {wizardState === "RESULT" && currentResult && (
            <div className="space-y-6 my-auto">
              <div className="flex items-center space-x-3 bg-blue-950/20 border border-blue-900/50 p-4 rounded-xl">
                <span className="text-xl">📋</span>
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
                    {t.diagnostics.diagnosticResult}
                  </h4>
                  <h3 className="text-base font-extrabold text-cyan-400">
                    {currentResult.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">
                  {t.diagnostics.recommendation}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded-xl border border-slate-850">
                  {currentResult.rec}
                </p>
              </div>

              {/* Security compromise caution reminder */}
              {resultKey === "security_disconnect" && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start space-x-2 text-red-400 text-xs leading-relaxed">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>
                    {isBg 
                      ? "ВНИМАНИЕ: Мрежовият кабел и Wi-Fi трябва да бъдат изключени незабавно, за да спрете криптирането на други споделени дискове във фирмата." 
                      : "CAUTION: Disconnect the LAN patch cable and Wi-Fi adapter immediately to isolate the computer and halt network infection spreads."}
                  </span>
                </div>
              )}

              {/* Q&A logs audit */}
              <div className="border-t border-slate-800/80 pt-6">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {isBg ? "Вашият отговор по стъпките:" : "Your diagnostics log:"}
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                  {answersLog.map((logItem, i) => (
                    <div key={i} className="flex flex-col border-b border-slate-800/30 pb-1.5 last:border-b-0">
                      <span className="text-slate-500 font-semibold">{logItem.q}</span>
                      <span className="text-slate-300 font-bold mt-0.5">→ {logItem.a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-slate-800/85 pt-4">
                ⚠️ {t.diagnostics.disclaimer}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/80">
                <button
                  onClick={handleConvertToTicket}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/10"
                >
                  {t.diagnostics.convertToTicket}
                </button>
                <button
                  onClick={handleStart}
                  className="flex-1 bg-slate-900 border border-slate-750 hover:bg-slate-800 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t.diagnostics.restart}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
