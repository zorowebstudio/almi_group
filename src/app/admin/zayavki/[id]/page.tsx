export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { translations } from "@/lib/translations";
import { 
  assignTechnician, updateTicketStatus, updateTicketPriority, 
  addInternalNote, sendTechnicianMessage 
} from "@/app/portal/actions";
import { 
  FileText, Shield, ArrowLeft, Clock, User, 
  Settings, AlertTriangle, ShieldAlert, PlusCircle, Check 
} from "lucide-react";

interface AdminTicketDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTicketDetails({ params }: AdminTicketDetailsProps) {
  const { id } = await params;

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

  // Fetch all available technicians and admins
  const technicians = await prisma.user.findMany({
    where: { role: { in: ["TECHNICIAN", "ADMIN"] } },
    select: { id: true, name: true, email: true }
  });

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
          href="/admin/zayavki"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад към списъка със заявки</span>
        </Link>
        <span className="text-[10px] text-slate-550">Последна промяна: {formatDate(ticket.updatedAt)}</span>
      </div>

      {/* Ticket Banner */}
      <div className="p-6 rounded-2xl bg-[#0D1F35] border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-900 border border-slate-800 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono">
              {ticket.ticketNumber}
            </span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border uppercase ${
              ticket.urgency === "CRITICAL" ? "bg-red-950/20 border border-red-900 text-red-450" : "bg-slate-900 text-slate-450 border-slate-850"
            }`}>
              СПЕШНОСТ: {translations.bg.ticket.urgencies[ticket.urgency as keyof typeof translations.bg.ticket.urgencies] || ticket.urgency}
            </span>
            <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              {translations.bg.ticket.supportMethods[ticket.supportMethod as keyof typeof translations.bg.ticket.supportMethods] || ticket.supportMethod}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">{ticket.subject}</h1>
          <p className="text-[11px] text-slate-400 font-semibold">
            Подател: {ticket.name} ({ticket.email} | {ticket.phone}) {ticket.company ? `• Фирма: ${ticket.company.name}` : ""}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-2">
          <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold">Управление</span>
          <span className="text-sm bg-blue-950 border border-blue-800 text-blue-400 px-3 py-1 rounded-lg font-black uppercase">
            {translations.bg.ticket.statuses[ticket.status as keyof typeof translations.bg.ticket.statuses] || ticket.status}
          </span>
        </div>
      </div>

      {/* Grid: Details, chat, technician selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Columns: Description & Client Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Initial Ticket Description */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Описание на повредата / казуса
            </h3>
            <p className="text-xs text-slate-200 bg-slate-900/60 p-4 rounded-lg border border-slate-850 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Client Messaging */}
          <div className="bg-[#0D1F35]/60 border border-slate-855 p-6 rounded-xl space-y-4 shadow-md">
            <h2 className="text-sm font-extrabold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <User className="h-4.5 w-4.5 text-blue-400" />
              <span>Чат с клиента</span>
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

            {/* Answer form */}
            <form action={async (formData: FormData) => {
              "use server";
              const text = formData.get("messageText") as string;
              await sendTechnicianMessage(ticket.id, text);
            }} className="pt-3 border-t border-slate-850 flex gap-2">
              <input
                type="text"
                name="messageText"
                placeholder="Напишете отговор до клиента..."
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
        </div>

        {/* Right 1 Column: Admin Controls */}
        <div className="space-y-6">
          {/* Assign Technician */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="h-4.5 w-4.5 text-blue-400" />
              <span>Назначи специалист</span>
            </h3>

            <form action={async (formData: FormData) => {
              "use server";
              const techId = formData.get("technicianId") as string;
              await assignTechnician(ticket.id, techId);
            }} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Изберете служител</label>
                <select
                  name="technicianId"
                  defaultValue={ticket.assignedTechnicianId || ""}
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
                >
                  <option value="">-- Неразпределена --</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-all cursor-pointer"
              >
                Разпредели
              </button>
            </form>
          </div>

          {/* Status Controls */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Settings className="h-4.5 w-4.5 text-indigo-400" />
              <span>Статус и Приоритет</span>
            </h3>

            <form action={async (formData: FormData) => {
              "use server";
              const status = formData.get("status") as string;
              const urgency = formData.get("urgency") as string;
              const notes = formData.get("notes") as string;
              await updateTicketStatus(ticket.id, status, notes);
              await updateTicketPriority(ticket.id, urgency);
            }} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Смяна на статус</label>
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
                <label className="text-[10px] text-slate-400 uppercase font-bold">Приоритет (Спешност)</label>
                <select
                  name="urgency"
                  defaultValue={ticket.urgency}
                  className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg focus:border-blue-500 outline-none text-white"
                >
                  <option value="LOW">Ниска</option>
                  <option value="NORMAL">Нормална</option>
                  <option value="HIGH">Висока</option>
                  <option value="CRITICAL">Спешна</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 uppercase font-bold">Пояснение за клиента</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Опционално пояснение..."
                  className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg focus:border-blue-500 outline-none text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-all cursor-pointer"
              >
                Запази настройките
              </button>
            </form>
          </div>

          {/* Internal Notes Panel */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-red-400" />
              <span>Технически бележки (Скрити за клиента)</span>
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
                placeholder="Запишете диагностична бележка..."
                className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg focus:border-blue-500 outline-none text-white text-xs resize-none"
              />
              <button
                type="submit"
                className="bg-slate-900 border border-slate-750 text-slate-350 hover:text-white px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer"
              >
                Добави бележка
              </button>
            </form>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {ticket.internalNotes.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">Няма записани вътрешни бележки.</p>
              ) : (
                ticket.internalNotes.map((note) => (
                  <div key={note.id} className="p-2.5 bg-slate-950/60 rounded border border-slate-850/80 text-[10px]">
                    <p className="text-slate-350 leading-relaxed font-semibold">{note.notes}</p>
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
