export const dynamic = "force-dynamic";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FileText, PlusCircle, ArrowUpRight } from "lucide-react";

export default async function PortalTickets() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const isB2B = session.role === "CUSTOMER_COMPANY";
  const ticketWhere = isB2B && session.companyId
    ? { companyId: session.companyId }
    : { customerId: session.id };

  const tickets = await prisma.ticket.findMany({
    where: ticketWhere,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-400" />
            <span>{t.portal.tabs.tickets}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Списък с всички получени и обработени технически заявки към Алми Груп.
          </p>
        </div>

        <Link
          href="/zayavi-pomosht"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md self-start sm:self-center"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Нова заявка</span>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-[#0D1F35] border border-slate-800 p-10 rounded-xl text-center space-y-3">
          <FileText className="h-10 w-10 text-slate-650 mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">
            Нямате регистрирани заявки за техническа помощ.
          </p>
          <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
            Ако имате нужда от съдействие за хардуерен ремонт, конфигуриране на мрежи, софтуерни инсталации или сигурност, можете бързо да заявите помощ.
          </p>
        </div>
      ) : (
        <div className="bg-[#0D1F35] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Заявка №</th>
                  <th className="py-4 px-5">Тема</th>
                  <th className="py-4 px-5">Услуга / Категория</th>
                  <th className="py-4 px-5">Метод</th>
                  <th className="py-4 px-5">Спешност</th>
                  <th className="py-4 px-5">Статус</th>
                  <th className="py-4 px-5 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[#12263F]/20 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-cyan-400 whitespace-nowrap">
                      {ticket.ticketNumber}
                    </td>
                    <td className="py-3.5 px-5 max-w-[200px] truncate font-semibold text-white">
                      {ticket.subject}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-slate-300">
                      <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 mr-2 font-semibold">
                        {t.ticket.categories[ticket.category as keyof typeof t.ticket.categories] || ticket.category}
                      </span>
                      {t.services.items[ticket.service as keyof typeof t.services.items]?.title || ticket.service}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-slate-450">
                      {t.ticket.supportMethods[ticket.supportMethod as keyof typeof t.ticket.supportMethods] || ticket.supportMethod}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                        ticket.urgency === "CRITICAL" ? "text-red-400 bg-red-950/20 border border-red-900/30" :
                        ticket.urgency === "HIGH" ? "text-orange-400 bg-orange-950/20 border border-orange-900/30" :
                        ticket.urgency === "NORMAL" ? "text-blue-400 bg-blue-950/10 border border-blue-900/20" :
                        "text-slate-400 bg-slate-900 border border-slate-800"
                      }`}>
                        {t.ticket.urgencies[ticket.urgency as keyof typeof t.ticket.urgencies] || ticket.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                        ticket.status === "COMPLETED" ? "text-green-400 bg-green-950/20 border border-green-900/30" :
                        ticket.status === "CANCELLED" ? "text-slate-500 bg-slate-900 border border-slate-800" :
                        ticket.status === "IN_PROGRESS" ? "bg-blue-950 border-blue-800 text-blue-400 border" :
                        ticket.status === "AWAITING_CONFIRMATION" ? "bg-yellow-950 border-yellow-800 text-yellow-400 border" :
                        "bg-slate-900 border-slate-800 text-slate-400 border"
                      }`}>
                        {t.ticket.statuses[ticket.status as keyof typeof t.ticket.statuses] || ticket.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/portal/zayavki/${ticket.id}`}
                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                      >
                        <span>Детайли</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
