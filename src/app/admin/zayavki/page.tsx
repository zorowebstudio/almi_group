export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { translations } from "@/lib/translations";
import { FileText, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default async function AdminTickets() {
  const tickets = await prisma.ticket.findMany({
    include: {
      technician: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-slate-500 bg-slate-900 border-slate-800 border";
      case "CANCELLED": return "text-red-500 bg-red-950/20 border-red-900/30 border";
      case "IN_PROGRESS": return "text-blue-400 bg-blue-950 border-blue-800 border";
      case "READY": return "text-green-400 bg-green-950 border-green-900 border";
      case "DIAGNOSING": return "text-purple-400 bg-purple-950 border-purple-900 border";
      case "RECEIVED": return "text-cyan-400 bg-cyan-950 border-cyan-900 border";
      default: return "text-slate-400 bg-slate-900 border-slate-850 border";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-400" />
          <span>Всички Технически Заявки</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Главен списък на инцидентите, постъпили от частни и фирмени клиенти или гости.
        </p>
      </div>

      <div className="bg-[#0D1F35] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Номер</th>
                <th className="py-4 px-5">Тема</th>
                <th className="py-4 px-5">Клиент / Фирма</th>
                <th className="py-4 px-5">Тип</th>
                <th className="py-4 px-5">Назначен Техник</th>
                <th className="py-4 px-5">Приоритет</th>
                <th className="py-4 px-5">Статус</th>
                <th className="py-4 px-5 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-[#12263F]/20 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-cyan-400 whitespace-nowrap font-mono">
                    {ticket.ticketNumber}
                  </td>
                  <td className="py-3.5 px-5 max-w-[180px] truncate font-semibold text-white">
                    {ticket.subject}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-200">{ticket.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{ticket.email}</p>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      ticket.clientType === "COMPANY" ? "bg-cyan-950 border border-cyan-900 text-cyan-400" : "bg-slate-900 border border-slate-800 text-slate-400"
                    }`}>
                      {ticket.clientType === "COMPANY" ? "Бизнес" : "Личен"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-slate-350">
                    {ticket.assignedTechnicianId ? (
                      <span className="flex items-center space-x-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{ticket.technician?.name}</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-yellow-500 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Няма техник</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ticket.urgency === "CRITICAL" ? "bg-red-950/20 text-red-400 border border-red-900" :
                      ticket.urgency === "HIGH" ? "bg-orange-950/20 text-orange-400 border border-orange-900" : "bg-slate-900 text-slate-450 border border-slate-850"
                    }`}>
                      {translations.bg.ticket.urgencies[ticket.urgency as keyof typeof translations.bg.ticket.urgencies] || ticket.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded font-black text-[9px] uppercase ${getStatusColor(ticket.status)}`}>
                      {translations.bg.ticket.statuses[ticket.status as keyof typeof translations.bg.ticket.statuses] || ticket.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/zayavki/${ticket.id}`}
                      className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                    >
                      <span>Регулиране</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
