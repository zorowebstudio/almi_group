"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Users, DollarSign, 
  Folder, BookOpen, Settings, ShieldAlert, ArrowLeft, LogOut, ChevronDown
} from "lucide-react";
import { UserSession } from "@/lib/auth";

interface AdminSidebarProps {
  session: UserSession;
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const allItems = [
    { href: "/admin", label: "Контролно Табло", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/admin/zayavki", label: "Всички Заявки", icon: <FileText className="h-4 w-4" /> },
    { href: "/admin/klienti", label: "Клиенти и Фирми", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/oferti", label: "Ценови Оферти", icon: <DollarSign className="h-4 w-4" /> },
    { href: "/admin/dokumenti", label: "Архив Документи", icon: <Folder className="h-4 w-4" /> },
    { href: "/admin/sadarzhanie", label: "Сайт Съдържание", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/nastroyki", label: "Системни Настройки", icon: <Settings className="h-4 w-4" /> },
  ];

  // Split into primary and secondary items for mobile views (Dashboard, Tickets, Clients are primary)
  const primaryMobileKeys = ["/admin", "/admin/zayavki", "/admin/klienti"];
  const primaryMobileItems = allItems.filter(item => primaryMobileKeys.includes(item.href));
  const secondaryMobileItems = allItems.filter(item => !primaryMobileKeys.includes(item.href));

  // Determine if active route is inside the "More" dropdown on mobile
  const isMoreActive = secondaryMobileItems.some(item => 
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getMobileShortLabel = (href: string, originalLabel: string) => {
    if (href === "/admin") return "Табло";
    if (href === "/admin/zayavki") return "Заявки";
    if (href === "/admin/klienti") return "Клиенти";
    return originalLabel;
  };

  return (
    <aside className="w-full md:w-64 bg-[#0A1626] border-b md:border-b-0 md:border-r border-slate-800/80 p-4 md:p-6 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-4 md:space-y-6">
        {/* Profile Info */}
        <div className="pb-3 border-b border-slate-800/60 flex md:block items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 text-red-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-[9px] uppercase tracking-widest font-black">
                Панел Администратор
              </span>
            </div>
            <p className="text-xs md:text-sm font-extrabold text-white mt-1 truncate max-w-[150px] md:max-w-none">
              {session.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
            title="Изход"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Desktop Navigation (Visible only on md screens and above) */}
        <nav className="hidden md:flex flex-col gap-1 select-none">
          {allItems.map((item) => {
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-slate-350 hover:text-white hover:bg-slate-850"
                }`}
              >
                <span className={isActive ? "text-white" : "text-cyan-400"}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 2. Mobile Navigation Row (Visible only below md screens) */}
        <nav className="flex md:hidden items-center justify-between gap-1 w-full relative select-none">
          {primaryMobileItems.map((item) => {
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all ${
                  isActive 
                    ? "text-cyan-400 bg-blue-950/20 border border-blue-900/20" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className={isActive ? "text-cyan-400" : "text-slate-450"}>{item.icon}</span>
                <span className="text-[9px] font-black mt-1">{getMobileShortLabel(item.href, item.label)}</span>
              </Link>
            );
          })}

          {/* More Action Trigger */}
          <div className="relative flex-1">
            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className={`w-full flex flex-col items-center justify-center py-1.5 rounded-xl transition-all focus:outline-none ${
                isMoreActive 
                  ? "text-cyan-400 bg-blue-950/20 border border-blue-900/20" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${mobileMoreOpen ? "rotate-180 text-cyan-400" : ""}`} />
              <span className="text-[9px] font-black mt-1">Още</span>
            </button>

            {/* Mobile Dropdown Panel for secondary items */}
            {mobileMoreOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setMobileMoreOpen(false)} />
                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-[#12263F] border border-slate-750 shadow-2xl py-2 z-50 animate-fade-in">
                  {secondaryMobileItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMoreOpen(false)}
                        className={`flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold transition-all ${
                          isActive 
                            ? "bg-blue-600 text-white" 
                            : "text-slate-300 hover:bg-[#1b3252] hover:text-white"
                        }`}
                      >
                        <span className={isActive ? "text-white" : "text-cyan-400"}>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/60 mt-4 md:mt-0">
        <Link
          href="/portal"
          className="flex items-center justify-center space-x-2 w-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Върни се в Портала</span>
        </Link>
      </div>
    </aside>
  );
}
