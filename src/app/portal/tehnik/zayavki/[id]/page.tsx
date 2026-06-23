export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { translations } from "@/lib/translations";
import { 
  claimTicket, updateTicketStatus, updateTicketPriority, 
  addInternalNote, generateServiceProtocol, sendTechnicianMessage 
} from "@/app/portal/actions";
import { 
  FileText, Shield, ArrowLeft, Clock, User, 
  Settings, AlertTriangle, ShieldAlert, PlusCircle, Check 
} from "lucide-react";

interface TechTicketDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function TechTicketDetails({ params }: TechTicketDetailsProps) {
  const { id } = await params;
  const session = await getUserSession();

  if (!session || (session.role !== "TECHNICIAN" && session.role !== "ADMIN")) {
    redirect("/portal");
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      customer: true,
      company: true,
      technician: true,
      timeline: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" } },
      internalNotes: { orderBy: { createdAt: "desc" } },
      quotes: { include: { items: true } }
    }
  });

  if (!ticket) {
    notFound();
  }

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
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/portal/tehnik/zayavki"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад към работния плот</span>
        </Link>
        <span className="text-[10px] text-slate-500">Последна промяна: {formatDate(ticket.updatedAt)}</span>
      </div>

      {/* Ticket Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1F35] border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-900 border border-slate-800 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono">
              {ticket.ticketNumber}
            </span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
              ticket.urgency === "CRITICAL" ? "bg-red-950/20 border-red-900/30 text-red-400" :
              ticket.urgency === "HIGH" ? "bg-orange-950/20 border border-orange-900 text-orange-400" : "bg-slate-900 text-slate-450 border-slate-850"
            }`}>
              СПЕШНОСТ: {translations.bg.ticket.urgencies[ticket.urgency as keyof typeof translations.bg.ticket.urgencies] || ticket.urgency}
            </span>
            <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              {translations.bg.ticket.supportMethods[ticket.supportMethod as keyof typeof translations.bg.ticket.supportMethods] || ticket.supportMethod}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">{ticket.subject}</h1>
          <p className="text-[11px] text-slate-400 font-semibold">
            Клиент: {ticket.name} ({ticket.email} | {ticket.phone}) {ticket.company ? `• Фирма: ${ticket.company.name}` : ""}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-2">
          <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold">Статус</span>
          <span className="text-sm bg-indigo-950 border border-indigo-850 text-indigo-400 px-3 py-1 rounded-lg font-black uppercase">
            {translations.bg.ticket.statuses[ticket.status as keyof typeof translations.bg.ticket.statuses] || ticket.status}
          </span>
        </div>
      </div>

      {/* Claim Option */}
      {!ticket.assignedTechnicianId && (
        <div className="p-6 rounded-2xl bg-yellow-950/15 border border-yellow-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-yellow-500 uppercase flex items-center space-x-1.5">
              <AlertTriangle className="h-4.5 w-4.5" />
              <span>Тази заявка все още не е поета!</span>
            </h2>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Заявката очаква техническо лице да яClaim-не в графика си и да започне диагностика.
            </p>
          </div>

          <form action={async () => {
            "use server";
            await claimTicket(ticket.id);
          }}>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-450 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
            >
              Поеми заявката
            </button>
          </form>
        </div>
      )}

      {/* Main Resolution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Columns: Client Communication & Service Protocol */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem description */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Първоначално описание на проблема
            </h3>
            <p className="text-xs text-slate-200 bg-slate-900/60 p-4 rounded-lg border border-slate-850 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Client Messaging */}
          <div className="bg-[#0D1F35]/60 border border-slate-850 p-6 rounded-xl space-y-4 shadow-md">
            <h2 className="text-sm font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <User className="h-4.5 w-4.5 text-blue-400" />
              <span>Комуникация с клиента</span>
            </h2>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {ticket.messages.filter(m => !m.isInternal).map((msg) => {
                const isClient = msg.senderId === ticket.customerId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      isClient ? "mr-auto items-start" : "ml-auto items-end"
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 mb-1 flex items-center space-x-1.5">
                      <span className="font-bold">{msg.senderName}</span>
                      <span>•</span>
                      <span>{formatDate(msg.createdAt)}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isClient
                          ? "bg-[#12263F] border border-slate-800 text-slate-200 rounded-tl-none"
                          : "bg-blue-600 text-white rounded-tr-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Answer client form */}
            <form action={async (formData: FormData) => {
              "use server";
              const text = formData.get("messageText") as string;
              await sendTechnicianMessage(ticket.id, text);
            }} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                name="messageText"
                placeholder="Изпратете съобщение до клиента..."
                required
                className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-xs"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 rounded-lg text-xs transition-all flex-shrink-0 cursor-pointer"
              >
                Изпрати
              </button>
            </form>
          </div>

          {/* Service Protocol Generator */}
          {ticket.status !== "COMPLETED" && (
            <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
              <h2 className="text-sm font-extrabold text-white flex items-center space-x-2 border-b border-slate-850 pb-3">
                <Check className="h-4.5 w-4.5 text-emerald-400" />
                <span>Генериране на сервизен протокол (Приключване)</span>
              </h2>

              <p className="text-[11px] text-slate-450 leading-relaxed">
                Напишете детайлен технически отчет за извършената работа. Системата автоматично ще генерира приемо-предавателен протокол в PDF и ще го приложи към профила на клиента, променяйки статуса на заявката на **READY**.
              </p>

              <form action={async (formData: FormData) => {
                "use server";
                const text = formData.get("protocolText") as string;
                await generateServiceProtocol(ticket.id, text);
              }} className="space-y-3">
                <textarea
                  name="protocolText"
                  rows={4}
                  required
                  placeholder="напр. Извършено почистване от прах, подменена термопаста, инсталирани драйвери за принтер, тествана мрежова свързаност..."
                  className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg focus:border-blue-500 outline-none text-white text-xs resize-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Генерирай протокол и приключи
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right 1 Column: Note panels, Priority details, Status config */}
        <div className="space-y-6">
          {/* Status Controls */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Settings className="h-4.5 w-4.5 text-indigo-400" />
              <span>Контрол на състояние</span>
            </h3>

            <form action={async (formData: FormData) => {
              "use server";
              const status = formData.get("status") as string;
              const notes = formData.get("notes") as string;
              await updateTicketStatus(ticket.id, status, notes);
            }} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Избор на статус</label>
                <select
                  name="status"
                  defaultValue={ticket.status}
                  className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg focus:border-blue-500 outline-none text-white font-semibold"
                >
                  <option value="RECEIVED">Получена</option>
                  <option value="DIAGNOSING">В диагностика</option>
                  <option value="AWAITING_CONFIRMATION">Изчаква потвърждение / Оферта</option>
                  <option value="IN_PROGRESS">В процес на работа</option>
                  <option value="READY">Готова</option>
                  <option value="COMPLETED">Приключена</option>
                  <option value="CANCELLED">Отказана</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Обяснителна бележка (към клиента)</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Опционално обяснение за смяната..."
                  className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg focus:border-blue-500 outline-none text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-all cursor-pointer"
              >
                Обнови статус
              </button>
            </form>
          </div>

          {/* Internal Notes Panel */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-red-400" />
              <span>Технически дневник (Скрит за клиента)</span>
            </h3>

            {/* Note form */}
            <form action={async (formData: FormData) => {
              "use server";
              const text = formData.get("noteText") as string;
              await addInternalNote(ticket.id, text);
            }} className="space-y-2">
              <textarea
                name="noteText"
                rows={2}
                required
                placeholder="Запишете вътрешна диагностична бележка..."
                className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg focus:border-blue-500 outline-none text-white text-xs resize-none"
              />
              <button
                type="submit"
                className="bg-slate-900 border border-slate-750 text-slate-300 hover:text-white px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer"
              >
                Добави бележка
              </button>
            </form>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {ticket.internalNotes.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">Няма записани вътрешни бележки.</p>
              ) : (
                ticket.internalNotes.map((note) => (
                  <div key={note.id} className="p-2.5 bg-slate-950/60 rounded border border-slate-850/80 text-[10px]">
                    <p className="text-slate-350 leading-relaxed font-medium">{note.notes}</p>
                    <p className="text-[8px] text-slate-550 mt-1">{formatDate(note.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
