"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "./LocaleProvider";
import { translations } from "@/lib/translations";
import { ThemeToggle } from "./ThemeToggle";
import { UserSession } from "@/lib/auth";
import { Menu, X, ChevronDown, Phone, User, Settings, LogOut, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
 
interface NavbarProps {
  session: UserSession | null;
}
 
export function Navbar({ session }: NavbarProps) {
  const { locale, setLanguage } = useLocale();
  const t = translations[locale];
  const pathname = usePathname();
  const router = useRouter();
 
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
 
  // Monitor scroll height to adjust height and background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  // Close dropdowns on route change
  useEffect(() => {
    requestAnimationFrame(() => {
      setMobileMenuOpen(false);
      setServicesDropdownOpen(false);
      setCompanyDropdownOpen(false);
    });
  }, [pathname]);
 
  // Lock background scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
 
  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
 
  const serviceKeys = Object.keys(t.services.items) as Array<keyof typeof t.services.items>;
 
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
 
  const isBg = locale === "bg";
  const isServicesActive = pathname.startsWith("/uslugi");
  const isCompanyActive = pathname === "/za-nas" || pathname === "/kontakti" || pathname === "/diagnostika" || pathname.startsWith("/help");
 
  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 flex items-center ${
          scrolled
            ? "h-[72px] bg-[#07111F]/95 backdrop-blur-md shadow-lg border-b border-slate-800/80 shadow-black/35"
            : "h-[80px] bg-[#07111F]/40 backdrop-blur-sm border-b border-slate-800/20"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Left Zone: Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0 select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-cyan-400/25 transition-all">
                <Cpu className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                Алми Груп
              </span>
            </Link>
 
            {/* Center Zone: Primary Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${
                  pathname === "/" ? "text-cyan-400" : "text-slate-300 hover:text-white"
                }`}
              >
                {t.nav.home}
              </Link>
 
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className={`flex items-center px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all focus:outline-none ${
                    isServicesActive ? "text-cyan-400" : "text-slate-300 hover:text-white"
                  }`}
                  aria-expanded={servicesDropdownOpen}
                >
                  <span>{t.nav.services}</span>
                  <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform duration-250 ${servicesDropdownOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>
 
                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                      className="absolute left-0 mt-1 w-80 rounded-2xl bg-[#12263F] border border-slate-750 shadow-xl py-2 z-50"
                    >
                      {serviceKeys.map((key) => (
                        <Link
                          key={key}
                          href={`/uslugi/${key}`}
                          className="block px-4 py-2.5 hover:bg-[#1b3252] transition-colors group"
                        >
                          <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {t.services.items[key].title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {t.services.items[key].desc}
                          </p>
                        </Link>
                      ))}
                      <div className="border-t border-slate-800/80 mt-1.5 pt-1.5">
                        <Link
                          href="/uslugi"
                          className="block text-center text-xs font-bold text-cyan-400 hover:text-cyan-300 py-1.5 transition-colors"
                        >
                          {isBg ? "Всички услуги →" : "All Services →"}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
 
              <Link
                href="/firmi"
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${
                  pathname === "/firmi" ? "text-cyan-400" : "text-slate-300 hover:text-white"
                }`}
              >
                {t.nav.forBusinesses}
              </Link>
 
              {/* Diagnostics: visible only at xl */}
              <Link
                href="/diagnostika"
                className={`hidden xl:inline-block px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${
                  pathname === "/diagnostika" ? "text-cyan-400" : "text-slate-300 hover:text-white"
                }`}
              >
                {t.nav.diagnostics}
              </Link>
 
              {/* Help Center: visible only at xl */}
              <Link
                href="/help"
                className={`hidden xl:inline-block px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all ${
                  pathname.startsWith("/help") || pathname === "/faq" ? "text-cyan-400" : "text-slate-300 hover:text-white"
                }`}
              >
                {t.nav.helpCenter}
              </Link>
 
              {/* Company Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setCompanyDropdownOpen(true)}
                  onMouseLeave={() => setCompanyDropdownOpen(false)}
                  onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                  className={`flex items-center px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all focus:outline-none ${
                    isCompanyActive ? "text-cyan-400" : "text-slate-300 hover:text-white"
                  }`}
                  aria-expanded={companyDropdownOpen}
                >
                  <span>{isBg ? "Фирмата" : "Company"}</span>
                  <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform duration-250 ${companyDropdownOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>
 
                <AnimatePresence>
                  {companyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setCompanyDropdownOpen(true)}
                      onMouseLeave={() => setCompanyDropdownOpen(false)}
                      className="absolute left-0 mt-1 w-60 rounded-2xl bg-[#12263F] border border-slate-750 shadow-xl py-2 z-50"
                    >
                      <Link
                        href="/za-nas"
                        className="block px-4 py-2.5 hover:bg-[#1b3252] transition-colors group"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {t.nav.aboutUs}
                        </p>
                      </Link>
                      <Link
                        href="/kontakti"
                        className="block px-4 py-2.5 hover:bg-[#1b3252] transition-colors group"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {t.nav.contacts}
                        </p>
                      </Link>
 
                      {/* Adaptively display sub-links in dropdown only on lg screen width (hidden on xl) */}
                      <Link
                        href="/diagnostika"
                        className="block xl:hidden px-4 py-2.5 hover:bg-[#1b3252] transition-colors group border-t border-slate-800"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {t.nav.diagnostics}
                        </p>
                      </Link>
                      <Link
                        href="/help"
                        className="block xl:hidden px-4 py-2.5 hover:bg-[#1b3252] transition-colors group"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {t.nav.helpCenter}
                        </p>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
 
            {/* Right Zone: Utility Actions */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              {/* Phone icon button (on lg) and full text inline label (on xl) */}
              <a
                href="tel:+359888002455"
                className="flex items-center justify-center xl:space-x-2 h-10 px-3 xl:px-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-350 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all focus:outline-none"
                title={t.nav.phone}
              >
                <Phone className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" />
                <span className="hidden xl:inline text-xs font-black whitespace-nowrap tracking-wide">088 800 2455</span>
              </a>
 
              {/* Language Toggle */}
              <div className="flex items-center bg-slate-800/30 border border-slate-700/30 rounded-xl p-0.5 h-10 flex-shrink-0 select-none">
                <button
                  onClick={() => setLanguage("bg")}
                  className={`w-9 h-8 flex items-center justify-center text-xs font-black rounded-lg transition-all focus:outline-none ${
                    locale === "bg"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  BG
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`w-9 h-8 flex items-center justify-center text-xs font-black rounded-lg transition-all focus:outline-none ${
                    locale === "en"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  EN
                </button>
              </div>
 
              {/* Sun/Moon Theme Toggle */}
              <ThemeToggle />
 
              {/* Login / Profile */}
              {session ? (
                <div className="relative group">
                  <Link
                    href={session.role === "ADMIN" ? "/admin" : "/portal"}
                    className="w-10 xl:w-auto h-10 flex items-center justify-center xl:space-x-2 xl:px-3.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-350 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all focus:outline-none"
                    title={t.nav.portal}
                  >
                    <User className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" />
                    <span className="hidden xl:inline text-xs font-bold max-w-[80px] truncate">{session.name}</span>
                  </Link>
                  {/* Logged in Dropdown */}
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#12263F] border border-slate-800 shadow-xl py-1.5 hidden group-hover:block z-50">
                    <Link
                      href="/portal"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1b3252] hover:text-white transition-colors font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      <span>{t.nav.portal}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/vhod"
                  className="w-10 xl:w-auto h-10 flex items-center justify-center xl:space-x-2 xl:px-3.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-350 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all font-bold text-xs focus:outline-none"
                  title={t.nav.login}
                >
                  <User className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" />
                  <span className="hidden xl:inline">{t.nav.login}</span>
                </Link>
              )}
 
              {/* Primary Call to Action */}
              <Link
                href="/zayavi-pomosht"
                className="flex items-center justify-center h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-600/10 hover:shadow-blue-600/25 transition-all whitespace-nowrap select-none"
              >
                {t.nav.requestHelp}
              </Link>
            </div>
 
            {/* Mobile Menu Action Toggle row (hidden on desktop) */}
            <div className="flex lg:hidden items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all focus:outline-none"
                aria-label="Open Mobile Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
 
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-45 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            {/* Sliding navigation panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#0D1F35] border-l border-slate-800 shadow-2xl flex flex-col justify-between p-6 lg:hidden overflow-y-auto"
            >
              <div>
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                      <Cpu className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-lg font-black text-white">Алми Груп</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
 
                {/* Navigation Links */}
                <div className="space-y-4">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-bold transition-all ${
                      pathname === "/" ? "bg-blue-600/10 text-cyan-400" : "text-slate-350 hover:text-white"
                    }`}
                  >
                    {t.nav.home}
                  </Link>
 
                  {/* Collapsible Services Mobile */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-base font-bold text-slate-350 hover:text-white hover:bg-slate-800/40 transition-all focus:outline-none"
                    >
                      <span>{t.nav.services}</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180 text-cyan-400" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-6 pr-2 space-y-2 mt-1"
                        >
                          {serviceKeys.map((key) => (
                            <Link
                              key={key}
                              href={`/uslugi/${key}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block py-1 text-sm font-semibold transition-all ${
                                pathname === `/uslugi/${key}` ? "text-cyan-400" : "text-slate-455 hover:text-slate-200"
                              }`}
                            >
                              {t.services.items[key].title}
                            </Link>
                          ))}
                          <Link
                            href="/uslugi"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all animate-fade-in"
                          >
                            {isBg ? "Всички услуги →" : "All Services →"}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
 
                  <Link
                    href="/firmi"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-bold transition-all ${
                      pathname === "/firmi" ? "bg-blue-600/10 text-cyan-400" : "text-slate-350 hover:text-white"
                    }`}
                  >
                    {t.nav.forBusinesses}
                  </Link>
 
                  <Link
                    href="/diagnostika"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-bold transition-all ${
                      pathname === "/diagnostika" ? "bg-blue-600/10 text-cyan-400" : "text-slate-350 hover:text-white"
                    }`}
                  >
                    {t.nav.diagnostics}
                  </Link>
 
                  <Link
                    href="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-bold transition-all ${
                      pathname.startsWith("/help") ? "bg-blue-600/10 text-cyan-400" : "text-slate-350 hover:text-white"
                    }`}
                  >
                    {t.nav.helpCenter}
                  </Link>
 
                  <Link
                    href="/za-nas"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-bold transition-all ${
                      pathname === "/za-nas" ? "bg-blue-600/10 text-cyan-400" : "text-slate-350 hover:text-white"
                    }`}
                  >
                    {t.nav.aboutUs}
                  </Link>
 
                  <Link
                    href="/kontakti"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-bold transition-all ${
                      pathname === "/kontakti" ? "bg-blue-600/10 text-cyan-400" : "text-slate-350 hover:text-white"
                    }`}
                  >
                    {t.nav.contacts}
                  </Link>
                </div>
              </div>
 
              {/* Bottom utility region of drawer */}
              <div className="border-t border-slate-800 pt-6 space-y-6 mt-auto">
                <a
                  href="tel:+359888002455"
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl bg-slate-800/20 border border-slate-800/80 text-slate-350 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                >
                  <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm font-bold whitespace-nowrap">088 800 2455</span>
                </a>
 
                {/* Language switcher + Theme row */}
                <div className="flex items-center justify-between px-3 select-none">
                  <div className="flex items-center bg-slate-800/40 border border-slate-700/50 rounded-xl p-0.5">
                    <button
                      onClick={() => setLanguage("bg")}
                      className={`px-3 py-1 text-xs font-black rounded-lg transition-all focus:outline-none ${
                        locale === "bg" ? "bg-blue-600 text-white shadow-md shadow-blue-600/15" : "text-slate-400"
                      }`}
                    >
                      БГ
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-3 py-1 text-xs font-black rounded-lg transition-all focus:outline-none ${
                        locale === "en" ? "bg-blue-600 text-white shadow-md shadow-blue-600/15" : "text-slate-400"
                      }`}
                    >
                      EN
                    </button>
                  </div>
 
                  <ThemeToggle />
                </div>
 
                {/* Auth and request CTA button */}
                <div className="flex flex-col space-y-3 px-3">
                  {session ? (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/portal"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center space-x-2 w-full bg-slate-800 border border-slate-750 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-750 transition-all focus:outline-none"
                      >
                        <User className="h-4.5 w-4.5 text-cyan-400" />
                        <span>{session.name}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center space-x-2 w-full bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 py-3 rounded-xl text-sm font-bold transition-all focus:outline-none"
                      >
                        <LogOut className="h-4.5 w-4.5" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/vhod"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full bg-slate-800 border border-slate-750 text-slate-300 py-3 rounded-xl text-sm font-bold hover:bg-slate-750 transition-all focus:outline-none"
                    >
                      <User className="h-4.5 w-4.5 text-cyan-400" />
                      <span>{t.nav.login}</span>
                    </Link>
                  )}
 
                  <Link
                    href="/zayavi-pomosht"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-600/15 hover:shadow-blue-600/25 transition-all focus:outline-none"
                  >
                    {t.nav.requestHelp}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
