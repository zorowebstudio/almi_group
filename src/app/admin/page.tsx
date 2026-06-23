import { prisma } from "@/lib/db";
import { 
  FileText, Users, DollarSign, Activity, 
  ShieldCheck, ShieldAlert, Clock, RefreshCw 
} from "lucide-react";

export default async function AdminDashboard() {
  // Fetch system statistics
  const [
    totalTickets,
    activeTickets,
    criticalTickets,
    totalUsers,
    totalCompanies,
    pendingQuotes,
    auditLogs
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({
      where: { NOT: { status: { in: ["COMPLETED", "CANCELLED"] } } }
    }),
    prisma.ticket.count({
      where: { urgency: "CRITICAL", NOT: { status: { in: ["COMPLETED", "CANCELLED"] } } }
    }),
    prisma.user.count({
      where: { role: { in: ["CUSTOMER_PRIVATE", "CUSTOMER_COMPANY"] } }
    }),
    prisma.company.count(),
    prisma.quote.count({ where: { status: "SENT" } }),
    prisma.auditLog.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    })
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("bg-BG");
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1F35] border border-slate-800 flex justify-between items-center shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white">Административен пул</h1>
          <p className="text-xs text-slate-400">
            Добре дошли в главното управление на Алми Груп ООД. Тук следите дейността по поддръжка в реално време.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-emerald-400 font-bold">
          <ShieldCheck className="h-4.5 w-4.5" />
          <span>Сървър: Защитен</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Active Support incidents */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/80 rounded-xl space-y-3 shadow-md hover:border-slate-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-slate-450 font-bold uppercase tracking-wide text-[10px]">В процес на работа</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{activeTickets} / {totalTickets}</p>
            <p className="text-[10px] text-slate-500 mt-1">Отворени казуса общо</p>
          </div>
        </div>

        {/* Critical Cases */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/80 rounded-xl space-y-3 shadow-md hover:border-slate-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-red-400 font-bold uppercase tracking-wide text-[10px]">Критични сривове</span>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
              <ShieldAlert className="h-4.5 w-4.5 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-red-400">{criticalTickets}</p>
            <p className="text-[10px] text-slate-500 mt-1">Изискват незабавна реакция</p>
          </div>
        </div>

        {/* Client base count */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/80 rounded-xl space-y-3 shadow-md hover:border-slate-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-slate-455 font-bold uppercase tracking-wide text-[10px]">Клиентска база</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{totalUsers}</p>
            <p className="text-[10px] text-slate-500 mt-1">Регистрирани потребители в {totalCompanies} фирми</p>
          </div>
        </div>

        {/* Pending quotes ratios */}
        <div className="p-5 bg-[#0D1F35] border border-slate-800/80 rounded-xl space-y-3 shadow-md hover:border-slate-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-slate-455 font-bold uppercase tracking-wide text-[10px]">Чакащи ценови оферти</span>
            <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{pendingQuotes}</p>
            <p className="text-[10px] text-slate-500 mt-1">Изпратени за клиентско одобрение</p>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Audit logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="h-4.5 w-4.5 text-blue-400" />
                <span>Дневник на събитията (Audit Log)</span>
              </h2>
              <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Последна активност</span>
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 text-xs">
              {auditLogs.length === 0 ? (
                <p className="text-center text-slate-500 py-6">Няма записани събития в одитния лог.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-900 border border-slate-850 rounded-lg flex items-start justify-between gap-3 text-slate-350 hover:bg-[#12263F]/20 transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold text-white leading-normal">{log.action}</p>
                      {log.details && <p className="text-[10px] text-slate-450 italic leading-relaxed">{log.details}</p>}
                      <p className="text-[9px] text-slate-550">
                        Извършено от: {log.user?.name || "Система"} ({log.user?.email || "system"})
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-550 font-semibold flex-shrink-0 whitespace-nowrap pt-0.5">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Action Shortcuts */}
        <div className="space-y-6">
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md text-xs">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Бързи административни връзки</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <a 
                href="/admin/zayavki" 
                className="flex justify-between items-center p-3 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all font-bold group"
              >
                <span>Разпредели и отговори на заявки</span>
                <Clock className="h-4 w-4 text-cyan-400 group-hover:text-white transition-all" />
              </a>

              <a 
                href="/admin/oferti" 
                className="flex justify-between items-center p-3 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all font-bold group"
              >
                <span>Изготви ценова оферта</span>
                <DollarSign className="h-4 w-4 text-cyan-400 group-hover:text-white transition-all" />
              </a>

              <a 
                href="/admin/sadarzhanie" 
                className="flex justify-between items-center p-3 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all font-bold group"
              >
                <span>Редактирай FAQ и статии</span>
                <FileText className="h-4 w-4 text-cyan-400 group-hover:text-white transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
