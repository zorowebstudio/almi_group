export const dynamic = "force-dynamic";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { 
  FileText, Calendar, DollarSign, Laptop, 
  ArrowRight, Activity, PlusCircle, ShieldAlert
} from "lucide-react";

export default async function PortalDashboard() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const isB2B = session.role === "CUSTOMER_COMPANY";
  
  // Scoping queries by company or individual client
  const ticketWhere = isB2B && session.companyId 
    ? { companyId: session.companyId } 
    : { customerId: session.id };
    
  const deviceWhere = isB2B && session.companyId
    ? { companyId: session.companyId }
    : { userId: session.id };

  const appointmentWhere = { customerId: session.id };

  const quoteWhere = isB2B && session.companyId
    ? { companyId: session.companyId, status: "SENT" }
    : { customerId: session.id, status: "SENT" };

  // Fetch Dashboard Stats
  const [activeTickets, appointments, quotes, devicesCount] = await Promise.all([
    prisma.ticket.findMany({
      where: {
        ...ticketWhere,
        NOT: { status: { in: ["COMPLETED", "CANCELLED"] } }
      },
      orderBy: { updatedAt: "desc" },
      take: 5
    }),
    prisma.appointment.findMany({
      where: {
        ...appointmentWhere,
        date: { gte: new Date(new Date().setHours(0,0,0,0)) },
        status: { in: ["PENDING", "CONFIRMED", "RESCHEDULED"] }
      },
      orderBy: { date: "asc" },
      take: 3
    }),
    prisma.quote.findMany({
      where: quoteWhere,
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.device.count({
      where: deviceWhere
    })
  ]);

  const activeTicketsCount = await prisma.ticket.count({
    where: {
      ...ticketWhere,
      NOT: { status: { in: ["COMPLETED", "CANCELLED"] } }
    }
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#0D1F35] to-[#12263F] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t.portal.welcome} {session.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            {isB2B 
              ? "Управлявайте техническата инфраструктура, служебните заявки, офиси и договори на Вашата компания от едно защитено място."
              : "Добре дошли в личния си клиентски профил. Тук можете да проследявате подадените заявки, да управлявате своите устройства и резервации."}
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Tickets Stat */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">{t.portal.dashboard.activeTickets}</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{activeTicketsCount}</span>
            <p className="text-[10px] text-slate-500 mt-1">Отворени казуси</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">{t.portal.dashboard.upcomingVisits}</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{appointments.length}</span>
            <p className="text-[10px] text-slate-500 mt-1">Насрочени сесии</p>
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-yellow-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">{t.portal.dashboard.pendingQuotes}</span>
            <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{quotes.length}</span>
            <p className="text-[10px] text-slate-500 mt-1">Чакащи одобрение</p>
          </div>
        </div>

        {/* Registered Devices */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">{t.portal.dashboard.registeredDevices}</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Laptop className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{devicesCount}</span>
            <p className="text-[10px] text-slate-500 mt-1">Вписани конфигурации</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tickets & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tickets List */}
          <div className="bg-[#0D1F35]/60 border border-slate-850 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <h2 className="text-sm sm:text-base font-extrabold text-white">Текущи заявки в процес</h2>
              </div>
              <Link href="/portal/zayavki" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
                <span>Виж всички</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {activeTickets.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                Нямате активни технически заявки в момента. Всички казуси са приключени.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {activeTickets.map((ticket) => (
                  <div key={ticket.id} className="py-3.5 flex items-center justify-between hover:bg-[#12263F]/20 px-2 rounded-lg transition-all">
                    <div className="space-y-1 min-w-0 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400">{ticket.ticketNumber}</span>
                        <span className="text-xs font-extrabold text-white truncate max-w-[180px] sm:max-w-[280px]">
                          {ticket.subject}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                        <span>{new Date(ticket.createdAt).toLocaleDateString("bg-BG")}</span>
                        <span>•</span>
                        <span className={`font-semibold ${
                          ticket.urgency === "CRITICAL" ? "text-red-400" :
                          ticket.urgency === "HIGH" ? "text-orange-400" : "text-slate-400"
                        }`}>
                          Приоритет: {t.ticket.urgencies[ticket.urgency as keyof typeof t.ticket.urgencies] || ticket.urgency}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ticket.status === "RECEIVED" ? "bg-slate-900 border-slate-800 text-slate-400" :
                      ticket.status === "DIAGNOSING" ? "bg-purple-950 border-purple-800 text-purple-400" :
                      ticket.status === "AWAITING_CONFIRMATION" ? "bg-yellow-950 border-yellow-800 text-yellow-400" :
                      ticket.status === "IN_PROGRESS" ? "bg-blue-950 border-blue-800 text-blue-400" :
                      ticket.status === "READY" ? "bg-green-950 border-green-800 text-green-400" : "bg-slate-850 text-slate-400"
                    }`}>
                      {t.ticket.statuses[ticket.status as keyof typeof t.ticket.statuses] || ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Quotes Alert Box */}
          {quotes.length > 0 && (
            <div className="bg-yellow-950/20 border border-yellow-800/40 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-2 text-yellow-400">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-sm font-extrabold">Внимание: Имате чакащи оферти</h3>
              </div>
              <p className="text-xs text-slate-400">
                Нашите специалисти изготвиха ценови предложения за решаване на Ваши казуси. Моля, разгледайте ги и ги одобрете, за да започнем работа.
              </p>
              <div className="space-y-2.5">
                {quotes.map((q) => (
                  <div key={q.id} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                    <div>
                      <p className="font-bold text-white">Оферта {q.quoteNumber}</p>
                      <p className="text-[10px] text-slate-500">Валидна до {new Date(q.expiryDate).toLocaleDateString("bg-BG")}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-yellow-400 text-sm">{q.totalAmount || "Индивидуална"} лв.</span>
                      <Link 
                        href="/portal/oferti" 
                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-1.5 rounded font-black tracking-wide text-[10px] transition-all"
                      >
                        Преглед
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Quick Actions & Appointments */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#0D1F35] border border-slate-800/80 p-6 rounded-xl space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.portal.dashboard.quickActions}
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              <Link 
                href="/zayavi-pomosht" 
                className="flex items-center justify-between p-3 rounded-lg bg-[#12263F] border border-slate-850 hover:border-blue-500/40 text-left text-xs font-bold text-white transition-all group"
              >
                <span>Нова заявка за помощ</span>
                <PlusCircle className="h-4 w-4 text-cyan-400 group-hover:text-white transition-all" />
              </Link>
              <Link 
                href="/rezervaciya" 
                className="flex items-center justify-between p-3 rounded-lg bg-[#12263F] border border-slate-850 hover:border-cyan-500/40 text-left text-xs font-bold text-white transition-all group"
              >
                <span>Заяви посещение на място</span>
                <Calendar className="h-4 w-4 text-cyan-400 group-hover:text-white transition-all" />
              </Link>
              <Link 
                href="/diagnostika" 
                className="flex items-center justify-between p-3 rounded-lg bg-[#12263F] border border-slate-850 hover:border-purple-500/40 text-left text-xs font-bold text-white transition-all group"
              >
                <span>Интерактивна диагностика</span>
                <Activity className="h-4 w-4 text-cyan-400 group-hover:text-white transition-all" />
              </Link>
            </div>
          </div>

          {/* Upcoming visits */}
          <div className="bg-[#0D1F35]/60 border border-slate-850 p-6 rounded-xl space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Предстоящи срещи и посещения
            </h2>
            {appointments.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                Няма насрочени посещения.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((app) => (
                  <div key={app.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">
                        {t.enums?.serviceTypes[app.serviceType as keyof typeof t.enums.serviceTypes] || app.serviceType}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {t.enums?.bookingStatuses[app.status as keyof typeof t.enums.bookingStatuses] || app.status}
                      </span>
                    </div>
                    <div className="text-slate-300 font-semibold">
                      {new Date(app.date).toLocaleDateString("bg-BG")} в {app.timeSlot}
                    </div>
                    {app.notes && (
                      <p className="text-[10px] text-slate-500 italic truncate">{app.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
