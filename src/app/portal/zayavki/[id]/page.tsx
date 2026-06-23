export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { acceptQuote, declineQuote } from "@/app/portal/actions";
import TicketChatForm from "@/components/TicketChatForm";
import { 
  FileText, Calendar, ArrowLeft, User, 
  MessageSquare, Clock, Laptop, Info, ShieldAlert
} from "lucide-react";

interface TicketDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetails({ params }: TicketDetailsProps) {
  const { id } = await params;
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  // Fetch ticket details with relations, filtering out internal notes
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      technician: { select: { name: true, email: true } },
      timeline: { orderBy: { createdAt: "desc" } },
      messages: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" }
      },
      quotes: {
        where: { NOT: { status: "DRAFT" } }, // Hide drafts from client
        include: { items: true }
      }
    }
  });

  if (!ticket) {
    notFound();
  }

  // Verify access authorization (Private client owns, or B2B company matches)
  if (session.role === "CUSTOMER_COMPANY" && session.companyId) {
    if (ticket.companyId !== session.companyId) {
      redirect("/portal/zayavki");
    }
  } else {
    if (ticket.customerId !== session.id) {
      redirect("/portal/zayavki");
    }
  }

  // Format date helper
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      {/* Top bar navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/portal/zayavki"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад към списъка</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Последна промяна: {formatDate(ticket.updatedAt)}</span>
        </div>
      </div>

      {/* Ticket Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1F35] border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-900 border border-slate-800 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono">
              {ticket.ticketNumber}
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
              ticket.urgency === "CRITICAL" ? "text-red-400 bg-red-950/20 border-red-900/30 animate-pulse" :
              ticket.urgency === "HIGH" ? "text-orange-400 bg-orange-950/20 border-orange-900/30" :
              ticket.urgency === "NORMAL" ? "text-blue-400 bg-blue-950/10 border-blue-900/20" : "text-slate-400"
            }`}>
              Спешност: {t.ticket.urgencies[ticket.urgency as keyof typeof t.ticket.urgencies] || ticket.urgency}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">{ticket.subject}</h1>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t.ticket.statusLabel}</span>
          <span className="text-sm bg-blue-950 border border-blue-800 text-blue-400 px-3 py-1 rounded-lg font-extrabold uppercase">
            {t.ticket.statuses[ticket.status as keyof typeof t.ticket.statuses] || ticket.status}
          </span>
        </div>
      </div>

      {/* Active Quote Panel (If exists and is pending) */}
      {ticket.quotes.filter(q => q.status === "SENT").map((quote) => (
        <div key={quote.id} className="p-6 rounded-2xl bg-yellow-950/20 border border-yellow-800/40 space-y-4 shadow-lg">
          <div className="flex items-center space-x-2 text-yellow-400">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-sm font-extrabold">Получена търговска оферта за този казус</h2>
          </div>
          <p className="text-xs text-slate-400">
            За изпълнението на тази заявка е изготвена следната оферта. Моля, прегледайте я и потвърдете, за да започнем работа:
          </p>

          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white">Оферта {quote.quoteNumber}</span>
              <span className="text-slate-500">Валидна до: {new Date(quote.expiryDate).toLocaleDateString("bg-BG")}</span>
            </div>
            
            {/* Quote Items */}
            <div className="space-y-2">
              {quote.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-slate-300">
                  <span>{item.description} (x{item.quantity} {item.unit})</span>
                  <span className="font-semibold">{item.lineTotal.toFixed(2)} лв.</span>
                </div>
              ))}
            </div>

            {quote.notes && (
              <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-850">
                Бележки: {quote.notes}
              </p>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-sm font-extrabold">
              <span className="text-white">Общо с ДДС:</span>
              <span className="text-yellow-400">{(quote.totalAmount || 0).toFixed(2)} лв.</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <form action={async () => {
              "use server";
              await acceptQuote(quote.id);
            }}>
              <button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-5 py-2 rounded-lg font-black tracking-wide text-xs transition-all shadow-md"
              >
                Одобрявам офертата
              </button>
            </form>
            <form action={async () => {
              "use server";
              await declineQuote(quote.id);
            }}>
              <button 
                type="submit" 
                className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all"
              >
                Отказвам офертата
              </button>
            </form>
          </div>
        </div>
      ))}

      {/* Main Grid: Details, Chat, Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Description & Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Initial Ticket Description */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Описание на проблема
            </h3>
            <p className="text-xs leading-relaxed text-slate-200 bg-slate-900/60 p-4 rounded-lg border border-slate-850 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Ticket message thread */}
          <div className="bg-[#0D1F35]/60 border border-slate-850 p-6 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <h2 className="text-sm sm:text-base font-extrabold text-white">Комуникация по казуса</h2>
            </div>

            {/* Chat Thread Area */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 space-y-3.5">
              {ticket.messages.length === 0 ? (
                <p className="text-center text-slate-500 py-6 text-xs">
                  Все още няма коментари. Напишете съобщение по-долу, за да се свържете с дежурния техник.
                </p>
              ) : (
                ticket.messages.map((msg) => {
                  const isCurrentUser = msg.senderId === session.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-1">
                        <span className="font-bold">{msg.senderName}</span>
                        <span>•</span>
                        <span>{formatDate(msg.createdAt)}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isCurrentUser
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-[#12263F] border border-slate-800 text-slate-200 rounded-tl-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Box */}
            <div className="pt-4 border-t border-slate-800">
              <TicketChatForm ticketId={ticket.id} />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Ticket Info & Timeline */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-[#0D1F35] border border-slate-800/80 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Детайли за заявката
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                <span className="text-slate-500">Подадена на:</span>
                <span className="text-slate-300 font-semibold">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                <span className="text-slate-500">Категория:</span>
                <span className="text-slate-300 font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-semibold">
                  {t.ticket.categories[ticket.category as keyof typeof t.ticket.categories] || ticket.category}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                <span className="text-slate-500">Метод на обслужване:</span>
                <span className="text-slate-300 font-semibold">
                  {t.ticket.supportMethods[ticket.supportMethod as keyof typeof t.ticket.supportMethods] || ticket.supportMethod}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                <span className="text-slate-500">Отговорен специалист:</span>
                <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                  <User className="h-3.5 w-3.5" />
                  <span>{ticket.technician?.name || "В процес на разпределение"}</span>
                </div>
              </div>
              {ticket.deviceRef && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-slate-500">Свързано устройство:</span>
                  <div className="flex items-center space-x-1.5 text-purple-400 font-semibold">
                    <Laptop className="h-3.5 w-3.5" />
                    <span>{ticket.deviceRef}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vertical Audit Timeline */}
          <div className="bg-[#0D1F35]/60 border border-slate-850 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Хронология на обработка
            </h3>

            <div className="relative pl-5 border-l-2 border-slate-850 space-y-6">
              {ticket.timeline.length === 0 ? (
                <div className="flex items-start space-x-3 text-xs text-slate-555">
                  <div className="absolute -left-1.5 top-1.5 h-3.5 w-3.5 bg-blue-500 border-2 border-[#07111F] rounded-full"></div>
                  <div>
                    <p className="font-bold text-slate-400">Заявката е вписана</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(ticket.createdAt)}</p>
                  </div>
                </div>
              ) : (
                ticket.timeline.map((history, idx) => {
                  const isFirst = idx === 0;
                  return (
                    <div key={history.id} className="relative">
                      <div className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-[#07111F] ${
                        isFirst ? "bg-cyan-400 ring-2 ring-cyan-500/20" : "bg-slate-700"
                      }`}></div>
                      <div className="text-xs space-y-1">
                        <p className={`font-bold ${isFirst ? "text-cyan-400" : "text-slate-300"}`}>
                          Статус: {t.ticket.statuses[history.newStatus as keyof typeof t.ticket.statuses] || history.newStatus}
                        </p>
                        {history.notes && (
                          <p className="text-[10px] text-slate-450 leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-850/60">
                            {history.notes}
                          </p>
                        )}
                        <p className="text-[9px] text-slate-550">{formatDate(history.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
