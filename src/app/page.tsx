"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop, Server, Wifi, Code, HelpCircle, HardDrive, 
  CheckCircle, ArrowRight, ShieldCheck, MapPin, 
  Phone, Copy, Clock, Mail, Check, MessageSquare, AlertCircle, ChevronDown
} from "lucide-react";

export default function HomePage() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";

  // Problem Selector State
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  // Calculator State
  const [employees, setEmployees] = useState(5);
  const [computers, setComputers] = useState(3);
  const [laptops, setLaptops] = useState(2);
  const [offices, setOffices] = useState(1);
  const [needsRemote, setNeedsRemote] = useState(true);
  const [needsOnsite, setNeedsOnsite] = useState(false);
  const [needsNetwork, setNeedsNetwork] = useState(false);
  const [needsPrinter, setNeedsPrinter] = useState(false);
  const [needsBackup, setNeedsBackup] = useState(false);
  const [needsSecurity, setNeedsSecurity] = useState(false);
  const [showCalculatorResult, setShowCalculatorResult] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Copy Address State
  const [addressCopied, setAddressCopied] = useState(false);

  // Calculate recommended package
  const handleCalculatePlan = () => {
    setShowCalculatorResult(true);
  };

  const getRecommendedPlan = () => {
    const totalDevices = computers + laptops;
    if (totalDevices > 15 || offices > 2 || needsSecurity || needsBackup) {
      return {
        name: t.calculator.plans.complete,
        details: t.calculator.planDetails.complete
      };
    } else if (totalDevices > 5 || needsOnsite || needsNetwork || needsPrinter) {
      return {
        name: t.calculator.plans.business,
        details: t.calculator.planDetails.business
      };
    } else {
      return {
        name: t.calculator.plans.basic,
        details: t.calculator.planDetails.basic
      };
    }
  };

  const recommendedPlan = getRecommendedPlan();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("София, ул. Цар Симеон 20");
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      setContactError(isBg ? "Моля попълнете всички задължителни полета." : "Please fill in all required fields.");
      return;
    }
    setContactSubmitting(true);
    setContactError("");

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setContactSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMsg("");
    } catch (err) {
      setContactError(isBg ? "Възникна грешка. Моля опитайте пак." : "An error occurred. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  // Map icons to services keys
  const getServiceIcon = (key: string) => {
    switch (key) {
      case "it-poddrazhka-za-firmi":
        return <Server className="h-6 w-6 text-cyan-400" />;
      case "remont-na-kompyutri":
        return <Laptop className="h-6 w-6 text-cyan-400" />;
      case "mrezhi-i-internet":
        return <Wifi className="h-6 w-6 text-cyan-400" />;
      case "softuerna-pomosht":
        return <Code className="h-6 w-6 text-cyan-400" />;
      case "distancionna-pomosht":
        return <HelpCircle className="h-6 w-6 text-cyan-400" />;
      case "arhivirane-i-zashtita":
        return <HardDrive className="h-6 w-6 text-cyan-400" />;
      default:
        return <Laptop className="h-6 w-6 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Background Video */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <HeroVideo />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto"
          >
            {isBg ? (
              <>
                IT проблемът спира работата Ви? <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Ние Ви връщаме онлайн.
                </span>
              </>
            ) : (
              <>
                IT issue stopping your work? <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  We bring you back online.
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg sm:text-xl text-slate-350 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {isBg 
              ? "Професионална компютърна поддръжка, диагностика, мрежови решения и техническа помощ за фирми и частни клиенти в София."
              : "Professional computer support, diagnostics, network solutions and technical assistance for businesses and private clients in Sofia."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none mb-12"
          >
            <Link
              href="/zayavi-pomosht"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:scale-[1.02] transition-all"
            >
              {t.nav.requestHelp}
            </Link>
            <a
              href={`tel:${t.nav.phone}`}
              className="w-full sm:w-auto bg-slate-900/60 border border-slate-750 backdrop-blur-sm hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <Phone className="h-5 w-5 text-cyan-400" />
              <span>{isBg ? `Обади се: ${t.nav.phone}` : `Call: ${t.nav.phone}`}</span>
            </a>
            <Link
              href="/proveri-zayavka"
              className="w-full sm:w-auto bg-transparent border border-slate-700 hover:bg-slate-800/40 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-base font-bold transition-all"
            >
              {t.nav.checkTicket}
            </Link>
          </motion.div>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/60 text-slate-400 text-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span>{isBg ? "За фирми и граждани" : "For offices & homes"}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span>{isBg ? "Локация: София" : "Location: Sofia"}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span>{isBg ? "Възможност за онлайн заявка" : "Online intake portal"}</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-0.5">
              <div className="flex items-center space-x-1">
                <span className="text-amber-500 font-bold">5.0</span>
                <span className="text-amber-500 font-bold">★ ★ ★ ★ ★</span>
              </div>
              <span className="text-xs text-slate-500">
                {isBg ? "5.0 от 2 отзива в Google" : "5.0 from 2 Google reviews"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="bg-[#0D1F35] border-y border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
            <span>📍 {isBg ? "София - ул. Цар Симеон 20" : "Sofia - Tsar Simeon St 20"}</span>
            <span>💻 {isBg ? "IT поддръжка за малкия бизнес" : "IT support for small business"}</span>
            <span>🏠 {isBg ? "Компютърна помощ за дома" : "Computer help for home"}</span>
            <span>⭐ {isBg ? "5.0 рейтинг в Google" : "5.0 rating in Google"}</span>
            <span>⚡ {isBg ? "Онлайн проследяване" : "Online tracking"}</span>
          </div>
        </div>
      </section>

      {/* 3. Service Cards */}
      <section className="py-20 bg-[#07111F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {t.services.title}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Object.keys(t.services.items) as Array<keyof typeof t.services.items>).map((key) => (
              <motion.div
                key={key}
                whileHover={{ y: -6 }}
                className="bg-[#12263F] border border-slate-800/60 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-700/80 transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-all">
                    {getServiceIcon(key)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {t.services.items[key].title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    {t.services.items[key].desc}
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {t.services.suitableFor} {key === "it-poddrazhka-za-firmi" || key === "arhivirane-i-zashtita" ? t.services.business : t.services.private}
                  </span>
                  <Link
                    href={`/uslugi/${key}`}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors"
                  >
                    <span>{t.services.ctaDetails}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Problem Selector */}
      <section className="py-20 bg-[#0D1F35] border-y border-slate-800/80 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              {t.problemSelector.title}
            </h2>
            <p className="text-slate-400">
              {t.problemSelector.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Object.keys(t.problemSelector.options).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedProblem(key)}
                className={`p-4 rounded-xl text-left border text-sm font-semibold transition-all ${
                  selectedProblem === key
                    ? "bg-blue-600/10 border-blue-500 text-cyan-400 shadow-md shadow-blue-500/5"
                    : "bg-[#12263F] border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {t.problemSelector.options[key as keyof typeof t.problemSelector.options]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedProblem && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-[#12263F] border border-slate-750 p-6 rounded-2xl mb-8"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    💡
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">
                      {isBg ? "Препоръка от Алми Груп:" : "Recommendation from Almi Group:"}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {t.problemSelector.responses[selectedProblem as keyof typeof t.problemSelector.responses]}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/diagnostika"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        {t.problemSelector.ctaDiag}
                      </Link>
                      <Link
                        href="/zayavi-pomosht"
                        className="bg-slate-900 border border-slate-750 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        {t.problemSelector.ctaRequest}
                      </Link>
                      <a
                        href={`tel:${t.nav.phone}`}
                        className="bg-transparent border border-slate-700 hover:bg-slate-800 text-cyan-400 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>{t.problemSelector.ctaCall}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-20 bg-[#07111F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold mb-4">
              {isBg ? "Как работи техническата помощ?" : "How does support work?"}
            </h2>
            <p className="text-slate-400">
              {isBg 
                ? "Прост и прозрачен процес в четири стъпки за Ваше удобство." 
                : "A simple and transparent four-step process for your convenience."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/4 left-1/8 right-1/8 h-0.5 bg-slate-800 z-0" />

            {[
              {
                step: "01",
                title: isBg ? "Изпращате заявка" : "Submit a request",
                desc: isBg ? "Попълнете нашата форма онлайн или ни се обадете по телефона." : "Fill out our intake form online or call us directly."
              },
              {
                step: "02",
                title: isBg ? "Уточняваме проблема" : "Clarify the problem",
                desc: isBg ? "Наш техник се свързва с Вас, за да потвърди детайлите и начина на помощ." : "Our technician contacts you to confirm details and setup diagnostic steps."
              },
              {
                step: "03",
                title: isBg ? "Получавате решение" : "Get a solution",
                desc: isBg ? "Извършваме отдалечена помощ, посещение на адрес или ремонт в сервиза." : "We deliver remote software configuration, address visit, or workshop repair."
              },
              {
                step: "04",
                title: isBg ? "Проследявате статуса" : "Track your ticket",
                desc: isBg ? "Следите напредъка и съобщенията по заявката си в реално време." : "Monitor milestones and technician logs inside our portal dashboard."
              }
            ].map((item, index) => (
              <div key={index} className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-blue-600 flex items-center justify-center text-cyan-400 font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-450 leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Business IT Support & Recommendation Calculator */}
      <section className="py-20 bg-[#0D1F35] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Business value text */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {isBg ? "Един IT партньор за целия Ви офис" : "One IT partner for your entire office"}
              </h2>
              <p className="text-slate-350 text-base leading-relaxed">
                {isBg
                  ? "Ние се грижим за Вашата технологична инфраструктура, за да можете Вие да се фокусирате върху бизнеса си. Абонаментната поддръжка за компании в София предлага стабилност и сигурност."
                  : "We manage your technology infrastructure so you can focus on growing your business. Subscription support for companies in Sofia offers stability, cybersecurity, and peace of mind."}
              </p>
              
              <ul className="space-y-3">
                {[
                  isBg ? "Единна точка за технически контакт за всички служители" : "Single point of tech contact for all staff members",
                  isBg ? "Инвентаризация и пълна история на софтуерните случаи" : "Inventory tracking and complete ticket history logging",
                  isBg ? "По-малко прекъсвания на работата благодарение на мониторинг" : "Reduced workflow downtime through preventative monitoring",
                  isBg ? "Помощ при планиране на хардуерни ъпгрейди и мрежи" : "Guidance in network upgrades and hardware updates",
                  isBg ? "Поддръжка на рутери, принтери и NAS устройства за съхранение" : "Support for office routers, printers, and NAS storage arrays"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  href="/firmi"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10"
                >
                  <span>{t.calculator.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Plan Calculator Card */}
            <div className="bg-[#12263F] border border-slate-750 p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <span>🧮</span>
                <span>{t.calculator.title}</span>
              </h3>

              <div className="space-y-4">
                {/* Employee Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <label className="text-slate-300">{t.calculator.employees}:</label>
                    <span className="text-cyan-400 font-bold">{employees}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={employees}
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* PC and Laptop inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.calculator.computers}</label>
                    <input
                      type="number"
                      min="0"
                      value={computers}
                      onChange={(e) => setComputers(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.calculator.laptops}</label>
                    <input
                      type="number"
                      min="0"
                      value={laptops}
                      onChange={(e) => setLaptops(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Offices count */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <label className="text-slate-300">{t.calculator.offices}:</label>
                    <span className="text-cyan-400 font-bold">{offices}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={offices}
                    onChange={(e) => setOffices(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsRemote}
                      onChange={(e) => setNeedsRemote(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Дистанционна поддръжка" : "Remote Support"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsOnsite}
                      onChange={(e) => setNeedsOnsite(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Посещения на място" : "On-Site Visits"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsNetwork}
                      onChange={(e) => setNeedsNetwork(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Поддръжка на мрежа" : "Network Support"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsPrinter}
                      onChange={(e) => setNeedsPrinter(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Поддръжка на принтер" : "Printer Support"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsBackup}
                      onChange={(e) => setNeedsBackup(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Автоматично архивиране" : "Backup Assistance"}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsSecurity}
                      onChange={(e) => setNeedsSecurity(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{isBg ? "Киберсигурност" : "Cybersecurity Advice"}</span>
                  </label>
                </div>

                {/* Calculate trigger */}
                <button
                  onClick={handleCalculatePlan}
                  className="w-full bg-slate-900 border border-slate-750 hover:bg-slate-800 text-cyan-400 py-3 rounded-xl text-sm font-bold tracking-wide transition-all mt-4"
                >
                  {isBg ? "Изчисли препоръчителен план" : "Calculate Recommended Plan"}
                </button>

                {/* Result Block */}
                <AnimatePresence>
                  {showCalculatorResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-950/20 border border-blue-900/50 p-4 rounded-xl mt-4"
                    >
                      <h4 className="text-xs text-slate-450 uppercase font-bold tracking-wider mb-1">
                        {t.calculator.resultTitle}
                      </h4>
                      <p className="text-base font-extrabold text-cyan-400 mb-2">
                        {recommendedPlan.name}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {recommendedPlan.details}
                      </p>
                      <Link
                        href="/firmi"
                        className="block text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        {t.calculator.cta}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Diagnostic Wizard Preview & Review */}
      <section className="py-20 bg-[#07111F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Diagnostics wizard preview */}
            <div className="bg-[#12263F] border border-slate-800/80 p-8 rounded-2xl space-y-6">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Laptop className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t.nav.diagnostics}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {isBg ? "Имате компютърен проблем?" : "Experiencing device issues?"}
              </h3>
              <p className="text-sm text-slate-350 leading-relaxed">
                {isBg 
                  ? "Спестете време с нашия интерактивен диагностичен асистент. Той ще Ви зададе няколко въпроса и ще Ви даде незабавни насоки за отстраняване на чести мрежови или хардуерни аварии."
                  : "Save time using our interactive diagnostics wizard. Answer a few questions about your device to get immediate actions for resolving simple Wi-Fi, OS, or hardware faults."}
              </p>
              <div className="pt-2">
                <Link
                  href="/diagnostika"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-500/10"
                >
                  <span>{isBg ? "Започни диагностика" : "Start Diagnostics"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Google Rating Section */}
            <div className="space-y-6 lg:pl-6">
              <div className="inline-flex items-center space-x-1.5 text-amber-500 bg-amber-500/5 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">
                <span>⭐</span>
                <span>{isBg ? "5.0 В GOOGLE РЕЙТИНГ" : "5.0 GOOGLE RATING"}</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">
                {isBg ? "Доказано качество на услугите" : "Proven Quality of Service"}
              </h3>
              <p className="text-slate-350 leading-relaxed">
                {isBg
                  ? "Нашата основна цел е бързото и трайно отстраняване на Вашите технически проблеми. Алми Груп ООД има перфектен рейтинг 5.0 в Google, базиран на реални публични отзиви."
                  : "Our primary objective is the fast and permanent resolution of your technical difficulties. Almi Group LTD holds a perfect 5.0 Google rating based on public reviews."}
              </p>
              <div className="p-5 bg-[#12263F]/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Алми Груп ООД</span>
                  <span className="text-amber-500 font-bold">★ ★ ★ ★ ★ 5.0</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isBg 
                    ? "Рейтингът е базиран изцяло на 2 публични Google отзива на клиенти, които се възползваха от нашите компютърни услуги в София. Ние не използваме фиктивни отзиви."
                    : "The rating is based on 2 public Google reviews from clients who used our computer repair services in Sofia. We do not display artificial or invented testimonials."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Knowledge Base & FAQ Preview */}
      <section className="py-20 bg-[#0D1F35] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* KB Articles Preview */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isBg ? "База знания и съвети" : "Helpful articles & advice"}
              </h2>
              <p className="text-slate-400 text-sm">
                {isBg
                  ? "Прочетете нашите кратки ръководства за защита на данни, оптимизация и базови мрежови проверки."
                  : "Read our quick tutorials on data safety, device speed, and basic network validation."}
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    slug: "kak-da-predpazim-kompyutara-ot-virusi",
                    cat: "SECURITY",
                    titleBg: "Как да защитим устройствата си от вируси и фишинг?",
                    titleEn: "How to protect our devices from viruses and phishing?",
                    readBg: "4 мин. четене",
                    readEn: "4 min read"
                  },
                  {
                    slug: "baven-kompyutar-optimizaciya-ssd",
                    cat: "COMPUTERS",
                    titleBg: "Защо компютърът работи бавно и как да го ускорим?",
                    titleEn: "Why is the computer running slow and how to speed it up?",
                    readBg: "3 мин. четене",
                    readEn: "3 min read"
                  },
                  {
                    slug: "kakvo-da-pravya-pri-prekasnal-internet",
                    cat: "NETWORK",
                    titleBg: "Какво да проверя, когато интернетът не работи?",
                    titleEn: "What to check when the internet is not working?",
                    readBg: "3 мин. четене",
                    readEn: "3 min read"
                  }
                ].map((art, idx) => (
                  <Link
                    key={idx}
                    href={`/help/${art.slug}`}
                    className="block bg-[#12263F] border border-slate-800/60 p-5 rounded-xl hover:border-slate-700 hover:bg-[#1b3252] transition-colors group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase bg-cyan-400/5 px-2 py-0.5 rounded">
                        {art.cat}
                      </span>
                      <span className="text-xs text-slate-500">
                        {isBg ? art.readBg : art.readEn}
                      </span>
                    </div>
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-sm">
                      {isBg ? art.titleBg : art.titleEn}
                    </h4>
                  </Link>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/help"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center space-x-1"
                >
                  <span>{isBg ? "Към Помощния център" : "Go to Help Center"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.faq.title}
              </h2>
              <p className="text-slate-400 text-sm">
                {isBg
                  ? "Отговори на най-често задаваните въпроси относно приемането на ремонти и дистанционна помощ."
                  : "Answers to our frequently asked questions about drop-offs and remote aid."}
              </p>
              
              <div className="space-y-3">
                {t.faq.items.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#12263F] border border-slate-800/60 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:text-cyan-400 focus:outline-none transition-colors"
                      aria-expanded={openFaqIndex === idx}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          openFaqIndex === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="p-4 pt-0 text-xs text-slate-350 border-t border-slate-800/80 leading-relaxed bg-[#1b3252]/10">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/faq"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center space-x-1"
                >
                  <span>{isBg ? "Виж всички въпроси" : "View all questions"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 bg-gradient-to-b from-[#07111F] to-[#0D1F35] relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t.forms.errors.required ? (isBg ? "Имате технически проблем?" : "Have a Technical Issue?") : ""}
          </h2>
          <p className="text-slate-350 text-base max-w-2xl mx-auto leading-relaxed">
            {isBg
              ? "Опишете случая и изпратете заявка. Ще получите ясно място, от което да проследявате следващите стъпки."
              : "Describe your case and submit an IT support request. You will receive a secure portal link to monitor the repair timeline."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/zayavi-pomosht"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-blue-500/15 transition-all hover:scale-[1.02]"
            >
              {t.nav.requestHelp}
            </Link>
            <a
              href={`tel:${t.nav.phone}`}
              className="w-full sm:w-auto bg-slate-900 border border-slate-750 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <Phone className="h-5 w-5 text-cyan-400" />
              <span>{t.nav.phone}</span>
            </a>
            <Link
              href="/proveri-zayavka"
              className="w-full sm:w-auto bg-transparent border border-slate-700 hover:bg-slate-800/40 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              {t.nav.checkTicket}
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Contact Section with Form and Map */}
      <section className="py-20 bg-[#07111F] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact details & Map */}
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">
                {isBg ? "Къде да ни намерите?" : "Where to find us?"}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">{isBg ? "Адрес:" : "Address:"}</h4>
                    <p className="text-sm text-slate-350">
                      {isBg ? "София, ул. „Цар Симеон“ 20" : "Sofia, Tsar Simeon St. 20"}
                    </p>
                    <button
                      onClick={handleCopyAddress}
                      className="mt-1 flex items-center space-x-1 text-xs text-cyan-400 hover:underline hover:text-cyan-300 focus:outline-none"
                    >
                      {addressCopied ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>{isBg ? "Копирано!" : "Copied!"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{isBg ? "Копирай адреса" : "Copy Address"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">{isBg ? "Работно време:" : "Working hours:"}</h4>
                    <p className="text-sm text-slate-350">
                      {isBg ? "Понеделник - Петък: 09:00 - 18:00" : "Monday - Friday: 09:00 - 18:00"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">{isBg ? "Телефон:" : "Phone:"}</h4>
                    <a href={`tel:${t.nav.phone}`} className="text-sm text-slate-350 hover:text-cyan-400 transition-colors">
                      {t.nav.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder or configured map component */}
              <div className="w-full h-72 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden relative group">
                <iframe
                  title="Google Map Sofia Tsar Simeon 20"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.2223847240375!2d23.323533815303644!3d42.70014297917822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa85721248003f%3A0xe54bb3f78e0ea5ad!2z0YPQuy4g0KbQsNGAINCh0LjQvNC10L7QvCAyMCwgMTAwMCDQodC-0YTQuNGP!5e0!3m2!1sbg!2sbg!4v1680000000000!5m2!1sbg!2sbg"
                  className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-3 right-3 z-10">
                  <a
                    href="https://maps.google.com/?q=София,+ул.+Цар+Симеон+20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#12263F] border border-slate-750 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-slate-700 transition-colors block"
                  >
                    🗺️ {isBg ? "Отвори в карти" : "Open in maps"}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-[#12263F] border border-slate-750 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">
                {isBg ? "Изпратете ни съобщение" : "Send us a message"}
              </h3>

              {contactSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-white">
                    {isBg ? "Съобщението е изпратено!" : "Message Sent Successfully!"}
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    {isBg 
                      ? "Благодарим Ви! Нашият екип ще се запознае с Вашето съобщение и ще се свърже с Вас при първа възможност."
                      : "Thank you! Our technical support team has received your message and will respond shortly."}
                  </p>
                  <button
                    onClick={() => setContactSuccess(false)}
                    className="bg-slate-900 border border-slate-750 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    {isBg ? "Изпрати друго съобщение" : "Send another message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.fullName} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t.forms.placeholders.fullName}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.email} *</label>
                      <input
                        type="email"
                        required
                        placeholder={t.forms.placeholders.email}
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">{t.forms.phone}</label>
                      <input
                        type="text"
                        placeholder={t.forms.placeholders.phone}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">{t.forms.description} *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder={isBg ? "С какво можем да помогнем?..." : "How can we help?..."}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {contactError && (
                    <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-3 rounded border border-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <span>{contactError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50"
                  >
                    {contactSubmitting ? t.forms.submitting : t.forms.submit}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
