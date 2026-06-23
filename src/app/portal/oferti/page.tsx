export const dynamic = "force-dynamic";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { acceptQuote, declineQuote } from "@/app/portal/actions";
import { DollarSign, ShieldAlert, FileText, Check, X, Calendar } from "lucide-react";

export default async function PortalQuotes() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const isB2B = session.role === "CUSTOMER_COMPANY";
  const quoteWhere = isB2B && session.companyId
    ? { companyId: session.companyId, NOT: { status: "DRAFT" } }
    : { customerId: session.id, NOT: { status: "DRAFT" } };

  const quotes = await prisma.quote.findMany({
    where: quoteWhere,
    include: {
      items: true,
      ticket: { select: { ticketNumber: true, subject: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-950/20 border-green-900/30 text-green-400 border";
      case "DECLINED": return "bg-red-950/20 border-red-900/30 text-red-400 border";
      case "SENT": return "bg-yellow-950/20 border-yellow-800/40 text-yellow-400 border animate-pulse";
      case "EXPIRED": return "bg-slate-900 border-slate-800 text-slate-500 border";
      default: return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  const getStatusName = (status: string) => {
    return t.enums?.quoteStatuses[status as keyof typeof t.enums.quoteStatuses] || status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-blue-400" />
          <span>{t.portal.tabs.quotes}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Разгледайте техническите оферти и договори, изпратени за одобрение от нашия екип.
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-[#0D1F35] border border-slate-800 p-10 rounded-xl text-center space-y-3">
          <DollarSign className="h-10 w-10 text-slate-650 mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">
            Няма активни оферти в профила Ви.
          </p>
          <p className="text-[10px] text-slate-550 max-w-sm mx-auto">
            Офертите се изготвят от наш администратор след първоначална диагностика на повреда или при заявено търговско проучване.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl shadow-md space-y-4 hover:border-slate-700/80 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-white">Оферта {quote.quoteNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusClass(quote.status)}`}>
                      {getStatusName(quote.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Издадена на: {new Date(quote.issueDate).toLocaleDateString("bg-BG")}</span>
                    </span>
                    <span>•</span>
                    <span>Валидна до: {new Date(quote.expiryDate).toLocaleDateString("bg-BG")}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Крайна цена (с ДДС)</span>
                  <span className="text-xl font-black text-cyan-400">{(quote.totalAmount || 0).toFixed(2)} лв.</span>
                </div>
              </div>

              {/* Related Ticket */}
              {quote.ticket && (
                <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded border border-slate-850 text-xs">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-400">Във връзка със заявка:</span>
                  <span className="font-bold text-white font-mono">{quote.ticket.ticketNumber}</span>
                  <span className="text-slate-500 truncate max-w-[200px] sm:max-w-md">- {quote.ticket.subject}</span>
                </div>
              )}

              {/* Items Breakdown */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Описани позиции</p>
                <div className="bg-slate-900/40 rounded-lg border border-slate-850 divide-y divide-slate-850/60 overflow-hidden">
                  {quote.items.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center text-xs text-slate-300 hover:bg-[#12263F]/10 transition-colors">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-white">{item.description}</p>
                        <p className="text-[10px] text-slate-500">
                          Ед. цена: {item.unitPrice.toFixed(2)} лв. / Количество: {item.quantity} {item.unit}
                        </p>
                      </div>
                      <span className="font-bold text-slate-200">{item.lineTotal.toFixed(2)} лв.</span>
                    </div>
                  ))}
                </div>
              </div>

              {quote.notes && (
                <div className="p-3 bg-slate-900/35 border border-slate-850/50 rounded-lg text-[10px] text-slate-500 italic">
                  Бележки: {quote.notes}
                </div>
              )}

              {quote.terms && (
                <div className="text-[9px] text-slate-550 border-t border-slate-850/50 pt-2 leading-relaxed">
                  Условия: {quote.terms}
                </div>
              )}

              {/* Interactive buttons */}
              {quote.status === "SENT" && (
                <div className="flex items-center space-x-3 pt-2">
                  <form action={async () => {
                    "use server";
                    await acceptQuote(quote.id);
                  }}>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-4 py-2 rounded-lg font-black tracking-wide text-xs transition-all shadow-md cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t.portal.quotes.accept}</span>
                    </button>
                  </form>

                  <form action={async () => {
                    "use server";
                    await declineQuote(quote.id);
                  }}>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      <span>{t.portal.quotes.decline}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
