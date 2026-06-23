export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import AdminCreateQuoteForm from "@/components/AdminCreateQuoteForm";
import { DollarSign, FileText, Calendar, ShieldCheck, AlertCircle } from "lucide-react";

export default async function AdminQuotes() {
  const [quotes, activeTickets] = await Promise.all([
    prisma.quote.findMany({
      include: {
        company: { select: { name: true } },
        ticket: { select: { ticketNumber: true, subject: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.ticket.findMany({
      where: { NOT: { status: { in: ["COMPLETED", "CANCELLED"] } } },
      select: { id: true, ticketNumber: true, subject: true, name: true }
    })
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "text-green-400 bg-green-950/20 border-green-900 border";
      case "DECLINED": return "text-red-400 bg-red-950/20 border-red-900 border";
      case "SENT": return "text-yellow-400 bg-yellow-950 border-yellow-900 border";
      default: return "text-slate-500 bg-slate-900 border-slate-800 border";
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "Одобрена";
      case "DECLINED": return "Отказана";
      case "SENT": return "Изпратена";
      case "EXPIRED": return "Изтекла";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-blue-400" />
          <span>Управление на Оферти</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Преглеждайте статуса на изпратените ценови предложения и изготвяйте нови изчисления за клиентите.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Quotes List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md text-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Всички оферти в системата ({quotes.length})
            </h2>

            {quotes.length === 0 ? (
              <p className="text-center text-slate-500 py-6">Няма издадени търговски оферти.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-450 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Оферта №</th>
                      <th className="py-3 px-4">Свързана Заявка</th>
                      <th className="py-3 px-4">Фирма / Клиент</th>
                      <th className="py-3 px-4">Стойност</th>
                      <th className="py-3 px-4">Валидност</th>
                      <th className="py-3 px-4">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-[#12263F]/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-white font-mono">{q.quoteNumber}</td>
                        <td className="py-3 px-4">
                          {q.ticket ? (
                            <span className="font-mono text-cyan-400 font-semibold">{q.ticket.ticketNumber}</span>
                          ) : "—"}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {q.company?.name || "Частно лице"}
                        </td>
                        <td className="py-3 px-4 font-black text-cyan-400">
                          {(q.totalAmount || 0).toFixed(2)} лв.
                        </td>
                        <td className="py-3 px-4 text-slate-450 font-mono">
                          {new Date(q.expiryDate).toLocaleDateString("bg-BG")}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusColor(q.status)}`}>
                            {getStatusName(q.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Quote Creator Form */}
        <div className="space-y-4">
          <AdminCreateQuoteForm tickets={activeTickets} />
        </div>
      </div>
    </div>
  );
}
