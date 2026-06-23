import Link from "next/link";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { FileText, User, Shield, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

export default async function TechnicianTickets() {
  const session = await getUserSession();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("bg-BG");
  };

  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    redirect("/portal");
  }

  // Fetch technician's assigned tickets (not completed/cancelled)
  const myTickets = await prisma.ticket.findMany({
    where: {
      assignedTechnicianId: session.id,
      NOT: { status: { in: ["COMPLETED", "CANCELLED"] } }
    },
    orderBy: { urgency: "desc" },
  });

  // Fetch unassigned tickets
  const unassignedTickets = await prisma.ticket.findMany({
    where: {
      assignedTechnicianId: null,
      NOT: { status: { in: ["COMPLETED", "CANCELLED"] } }
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch completed/cancelled tickets handled by this tech
  const archivedTickets = await prisma.ticket.findMany({
    where: {
      assignedTechnicianId: session.id,
      status: { in: ["COMPLETED", "CANCELLED"] }
    },
    orderBy: { updatedAt: "desc" },
    take: 10
  });

  const getStatusTranslation = (status: string) => {
    const map: Record<string, string> = {
      RECEIVED: "Получена",
      PENDING_REVIEW: "Очаква преглед",
      NEED_INFO: "Нужна е информация",
      SCHEDULED: "Насрочена",
      DIAGNOSING: "В диагностика",
      AWAITING_CONFIRMATION: "Изчаква потвърждение",
      IN_PROGRESS: "В процес на работа",
      READY: "Готова",
      COMPLETED: "Приключена",
      CANCELLED: "Отказана"
    };
    return map[status] || status;
  };

  const getUrgencyTranslation = (urgency: string) => {
    const map: Record<string, string> = {
      LOW: "Ниска",
      NORMAL: "Нормална",
      HIGH: "Висока",
      CRITICAL: "Спешна"
    };
    return map[urgency] || urgency;
  };

  const getSupportMethodTranslation = (method: string) => {
    const map: Record<string, string> = {
      REMOTE: "Дистанционна помощ",
      ON_SITE: "Посещение на място",
      OFFICE: "В наш сервиз"
    };
    return map[method] || method;
  };

  const getCategoryTranslation = (cat: string) => {
    const map: Record<string, string> = {
      HARDWARE: "Хардуер",
      SOFTWARE: "Софтуер",
      NETWORK: "Мрежа",
      SECURITY: "Сигурност",
      OTHER: "Друго"
    };
    return map[cat] || cat;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#0D1F35] to-[#12263F] border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">
              Работен панел за техници
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Техник: {session.name}</h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Преглеждайте чакащите проблеми, променяйте статуси, добавяйте сервизни протоколи и общувайте директно с клиентите.
          </p>
        </div>
      </div>

      {/* Main Grid: My Active and Unassigned */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Columns: Lists */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tickets */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-slate-850 pb-3">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white">Моите активни казуси ({myTickets.length})</h2>
            </div>

            {myTickets.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                В момента нямате лично разпределени активни заявки. Можете да поемете някоя от неразпределените.
              </div>
            ) : (
              <div className="divide-y divide-slate-850">
                {myTickets.map((ticket) => (
                  <div key={ticket.id} className="py-3.5 flex items-center justify-between hover:bg-[#12263F]/20 px-2 rounded-lg transition-colors">
                    <div className="min-w-0 pr-4 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-bold text-cyan-400 font-mono">{ticket.ticketNumber}</span>
                        <span className="font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">{ticket.subject}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          ticket.clientType === "COMPANY" ? "bg-cyan-950 border border-cyan-900 text-cyan-400" : "bg-slate-900 border border-slate-800 text-slate-400"
                        }`}>
                          {ticket.clientType === "COMPANY" ? "Бизнес" : "Личен"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-550">
                        <span>Клиент: {ticket.name}</span>
                        <span>•</span>
                        <span>{getSupportMethodTranslation(ticket.supportMethod)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ticket.urgency === "CRITICAL" ? "bg-red-950/20 border border-red-900 text-red-400 animate-pulse" :
                        ticket.urgency === "HIGH" ? "bg-orange-950/20 border border-orange-900 text-orange-400" : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}>
                        {getUrgencyTranslation(ticket.urgency)}
                      </span>
                      <Link
                        href={`/portal/tehnik/zayavki/${ticket.id}`}
                        className="bg-[#12263F] border border-slate-750 hover:bg-slate-800 text-cyan-400 hover:text-white px-3 py-1.5 rounded font-bold tracking-wide transition-all"
                      >
                        Отвори
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unassigned Tickets */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-slate-850 pb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />
              <h2 className="text-sm font-extrabold text-white">Неразпределени заявки ({unassignedTickets.length})</h2>
            </div>

            {unassignedTickets.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                Няма нови чакащи за разпределение заявки. Отлична работа!
              </div>
            ) : (
              <div className="divide-y divide-slate-850">
                {unassignedTickets.map((ticket) => (
                  <div key={ticket.id} className="py-3.5 flex items-center justify-between hover:bg-[#12263F]/20 px-2 rounded-lg transition-colors">
                    <div className="min-w-0 pr-4 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-bold text-yellow-500 font-mono">{ticket.ticketNumber}</span>
                        <span className="font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">{ticket.subject}</span>
                        <span className="text-[10px] text-slate-550">({getCategoryTranslation(ticket.category)})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-md">{ticket.description}</p>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <Link
                        href={`/portal/tehnik/zayavki/${ticket.id}`}
                        className="bg-yellow-500 hover:bg-yellow-450 text-slate-950 px-3 py-1.5 rounded font-black tracking-wide transition-all"
                      >
                        Поеми
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Archive & Actions */}
        <div className="space-y-6">
          {/* History panel */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-slate-850 pb-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Наскоро приключени</h3>
            </div>

            {archivedTickets.length === 0 ? (
              <p className="text-slate-500 text-[10px]">Няма приключени заявки от Вас в текущия отчетен период.</p>
            ) : (
              <div className="space-y-3">
                {archivedTickets.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-900 border border-slate-850 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-400 font-mono">{t.ticketNumber}</span>
                      <span className="text-slate-500">{formatDate(t.updatedAt)}</span>
                    </div>
                    <p className="font-bold text-white truncate">{t.subject}</p>
                    <span className="text-[9px] bg-green-950 border border-green-900 text-green-400 px-1 py-0.5 rounded font-bold uppercase inline-block">
                      {getStatusTranslation(t.status)}
                    </span>
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
