"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Laptop, Calendar, 
  DollarSign, Folder, MessageSquare, User, Building, Settings, Shield, LogOut, ChevronDown
} from "lucide-react";
import { translations } from "@/lib/translations";
import { UserSession } from "@/lib/auth";

interface PortalSidebarProps {
  session: UserSession;
  locale: "bg" | "en";
}

export function PortalSidebar({ session, locale }: PortalSidebarProps) {
  const pathname = usePathname();
  const t = translations[locale];
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const allItems = [
    { href: "/portal", label: t.portal.tabs.dashboard, icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/portal/zayavki", label: t.portal.tabs.tickets, icon: <FileText className="h-4 w-4" /> },
    { href: "/portal/ustroystva", label: t.portal.tabs.devices, icon: <Laptop className="h-4 w-4" /> },
    { href: "/portal/rezervacii", label: t.portal.tabs.bookings, icon: <Calendar className="h-4 w-4" /> },
    { href: "/portal/oferti", label: t.portal.tabs.quotes, icon: <DollarSign className="h-4 w-4" /> },
    { href: "/portal/dokumenti", label: t.portal.tabs.documents, icon: <Folder className="h-4 w-4" /> },
    { href: "/portal/chat", label: t.portal.tabs.chat, icon: <MessageSquare className="h-4 w-4" /> },
    { href: "/portal/profil", label: t.portal.tabs.profile, icon: <User className="h-4 w-4" /> },
  ];

  if (session.role === "CUSTOMER_COMPANY") {
    allItems.push({
      href: "/portal/firma",
      label: t.portal.tabs.company,
      icon: <Building className="h-4 w-4" />,
    });
  }

  if (session.role === "TECHNICIAN" || session.role === "ADMIN") {
    allItems.push({
      href: session.role === "ADMIN" ? "/admin" : "/portal/tehnik/zayavki",
      label: session.role === "ADMIN" ? "Администратор" : "Работен плот",
      icon: <Shield className="h-4 w-4" />,
    });
  }

  // Split into primary and secondary items for mobile views (Dashboard, Tickets, Devices, Bookings are primary)
  const primaryMobileKeys = ["/portal", "/portal/zayavki", "/portal/ustroystva", "/portal/rezervacii"];
  const primaryMobileItems = allItems.filter(item => primaryMobileKeys.includes(item.href));
  const secondaryMobileItems = allItems.filter(item => !primaryMobileKeys.includes(item.href));

  // Determine if active route is inside the "More" dropdown on mobile
  const isMoreActive = secondaryMobileItems.some(item => 
    item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href)
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
    if (locale === "bg") {
      if (href === "/portal") return "Табло";
      if (href === "/portal/zayavki") return "Заявки";
      if (href === "/portal/ustroystva") return "Уреди";
      if (href === "/portal/rezervacii") return "Часове";
    } else {
      if (href === "/portal") return "Dash";
      if (href === "/portal/zayavki") return "Tickets";
      if (href === "/portal/ustroystva") return "Devices";
      if (href === "/portal/rezervacii") return "Visits";
    }
    return originalLabel;
  };

  return (
    <aside className="w-full md:w-64 bg-[#0D1F35] border-b md:border-b-0 md:border-r border-slate-800/80 p-4 md:p-6 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-4 md:space-y-6">
        {/* User profile block */}
        <div className="pb-3 border-b border-slate-800/60 flex md:block items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] text-slate-550 uppercase tracking-wider font-bold">
              {session.role === "ADMIN" 
                ? t.portal.adminDashboard 
                : session.role === "TECHNICIAN" 
                ? t.portal.technicianDashboard 
                : t.portal.welcome}
            </p>
            <p className="text-xs md:text-sm font-black text-white truncate mt-0.5 max-w-[150px] md:max-w-none">
              {session.name}
            </p>
            <span className="text-[8px] bg-slate-900 border border-slate-800 text-cyan-400 px-1.5 py-0.5 rounded uppercase font-semibold inline-block mt-1">
              {session.role.replace("CUSTOMER_", "")}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
            title={t.nav.logout}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Desktop Navigation (Visible only on md screens and above) */}
        <nav className="hidden md:flex flex-col gap-1 select-none">
          {allItems.map((item) => {
            const isActive = item.href === "/portal" 
              ? pathname === "/portal" 
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-slate-350 hover:text-white hover:bg-[#12263F]/50"
                }`}
              >
                <span className={isActive ? "text-white" : "text-cyan-400"}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 2. Mobile Grid Navigation (Visible only below md screens, resolves scrolling/discoverability issues) */}
        <nav className="flex md:hidden items-center justify-between gap-1 w-full relative select-none">
          {primaryMobileItems.map((item) => {
            const isActive = item.href === "/portal" 
              ? pathname === "/portal" 
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

          {/* More Action Trigger for secondary links */}
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
              <span className="text-[9px] font-black mt-1">{locale === "bg" ? "Още" : "More"}</span>
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

      {/* Admin workspace quick link */}
      {(session.role === "ADMIN" || session.role === "TECHNICIAN") && (
        <div className="hidden md:block pt-4 border-t border-slate-800/60 mt-4 md:mt-0">
          <Link
            href={session.role === "ADMIN" ? "/admin" : "/portal/tehnik/zayavki"}
            className={`flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
              pathname.startsWith(session.role === "ADMIN" ? "/admin" : "/portal/tehnik/zayavki")
                ? "bg-blue-600 border border-blue-500 text-white shadow-md shadow-blue-600/10"
                : "bg-slate-900 border border-slate-750 text-cyan-400 hover:bg-slate-800"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>
              {session.role === "ADMIN" ? "Администратор" : "Работен плот"}
            </span>
          </Link>
        </div>
      )}
    </aside>
  );
}
