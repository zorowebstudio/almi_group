"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { translations } from "@/lib/translations";
import { 
  Search, ShieldAlert, Loader2, Calendar, 
  MapPin, Clock, MessageSquare, Send, CheckCircle2 
} from "lucide-react";

interface TicketMessage {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface TicketTimeline {
  id: string;
  createdAt: string;
  newStatus: string;
  notes?: string;
}

interface TrackedAppointment {
  id: string;
  timeSlot: string;
  date: string;
  serviceType: string;
  locationType: string;
}

interface TrackedTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  urgency: string;
  supportMethod: string;
  deviceType?: string;
  os?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TicketTimeline[];
  messages: TicketMessage[];
  appointments?: TrackedAppointment[];
}

function TrackTicketContent() {
  const { locale } = useLocale();
  const t = translations[locale];
  const isBg = locale === "bg";
  
  const searchParams = useSearchParams();

  // Search form fields
  const [ticketNo, setTicketNo] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Tracked ticket data
  const [ticket, setTicket] = useState<TrackedTicket | null>(null);

  // Chat message input
  const [chatMsg, setChatMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleTrack = useCallback(async (noStr = ticketNo, mailStr = email) => {
    if (!noStr || !mailStr) {
      setErrorMsg(isBg ? "Моля попълнете двете полета." : "Please fill in both fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setTicket(null);

    try {
      const response = await fetch("/api/tickets/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber: noStr, email: mailStr }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to find ticket");
      }

      setTicket(resData.ticket);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.ticket.notFound;
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, [ticketNo, email, isBg, t.ticket.notFound]);

  // Check URL parameters on mount to auto-search
  useEffect(() => {
    const no = searchParams.get("no");
    const mail = searchParams.get("email");
    if (no && mail) {
      requestAnimationFrame(() => {
        setTicketNo(no);
        setEmail(mail);
        handleTrack(no, mail);
      });
    }
  }, [searchParams, handleTrack]);

  // Scroll chat to bottom on updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || !ticket) return;

    setSendingMsg(true);
    try {
      const response = await fetch("/api/tickets/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          email: email.trim(),
          message: chatMsg.trim(),
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to send message");
      }

      // Add message locally to state
      setTicket({
        ...ticket,
        messages: [...ticket.messages, resData.message],
      });
      setChatMsg("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send message";
      alert(message);
    } finally {
      setSendingMsg(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-slate-800 text-slate-300 border-slate-750";
      case "DIAGNOSING":
      case "IN_PROGRESS":
        return "bg-blue-600/10 text-cyan-400 border-blue-500/20";
      case "READY":
        return "bg-emerald-600/15 text-emerald-400 border-emerald-500/20";
      case "COMPLETED":
        return "bg-slate-900 text-slate-500 border-slate-850";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-600/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="bg-[#07111F] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-8 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                {t.nav.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-350">{t.ticket.trackingTitle}</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.ticket.trackingTitle}
          </h1>
          <p className="text-sm text-slate-400">
            {t.ticket.trackingSubtitle}
          </p>
        </div>

        {/* Secure Search Box */}
        <div className="bg-[#12263F] border border-slate-800 p-6 rounded-2xl max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">{t.ticket.ticketNumber}</label>
              <input
                type="text"
                placeholder="ALMI-2026-0001"
                value={ticketNo}
                onChange={(e) => setTicketNo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">{t.forms.email}</label>
              <input
                type="email"
                placeholder={t.forms.placeholders.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-center space-x-2 text-red-400 text-xs bg-red-500/5 p-3 rounded border border-red-500/10">
              <ShieldAlert className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isBg ? "Зареждане..." : "Loading..."}</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>{t.ticket.checkBtn}</span>
              </>
            )}
          </button>
          
          <p className="text-[10px] text-slate-500 text-center mt-3 leading-relaxed">
            🔒 {t.ticket.maskedNotice}
          </p>
        </div>

        {/* Ticket Details Panel */}
        {ticket && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-[#12263F] border border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.ticket.statusLabel}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                    {t.ticket.statuses[ticket.status as keyof typeof t.ticket.statuses] || ticket.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="text-slate-500 font-semibold">{t.ticket.created}:</span>
                    <p className="text-slate-300 font-bold">
                      {new Date(ticket.createdAt).toLocaleDateString(isBg ? "bg-BG" : "en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">{t.ticket.urgencyLabel}:</span>
                    <p className="text-slate-350 font-semibold">
                      {t.ticket.urgencies[ticket.urgency as keyof typeof t.ticket.urgencies] || ticket.urgency}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">{isBg ? "Начин на помощ:" : "Support Channel:"}</span>
                    <p className="text-slate-350 font-semibold">
                      {t.ticket.supportMethods[ticket.supportMethod as keyof typeof t.ticket.supportMethods] || ticket.supportMethod}
                    </p>
                  </div>
                  {ticket.deviceType && (
                    <div>
                      <span className="text-slate-500 font-semibold">{t.forms.deviceType}:</span>
                      <p className="text-slate-350 font-semibold">{ticket.deviceType} ({ticket.os || "N/A"})</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Appointment */}
              {ticket.appointments && ticket.appointments.length > 0 && (
                <div className="bg-[#12263F] border border-slate-800 p-6 rounded-2xl space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span>{isBg ? "Насрочено посещение" : "Scheduled Appointment"}</span>
                  </h3>
                  <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                    <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{ticket.appointments[0].timeSlot}</span>
                    </div>
                    <p className="font-semibold text-slate-200">
                      {new Date(ticket.appointments[0].date).toLocaleDateString(isBg ? "bg-BG" : "en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-[10px] text-slate-550 uppercase pt-1 font-semibold">
                      {isBg ? "Тип: " : "Type: "} {t.enums?.serviceTypes[ticket.appointments[0].serviceType as keyof typeof t.enums.serviceTypes] || ticket.appointments[0].serviceType} ({ticket.appointments[0].locationType === "REMOTE" ? (isBg ? "Дистанционно" : "Remote") : ticket.appointments[0].locationType === "OFFICE" ? (isBg ? "В офис" : "Office") : (isBg ? "На място" : "On-site")})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Main timeline & communications */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header Title */}
              <div className="bg-[#12263F] border border-slate-800 p-6 rounded-2xl shadow-sm">
                <span className="text-xs text-slate-500 font-bold tracking-wider">{t.ticket.detailsTitle}</span>
                <h2 className="text-lg font-bold text-white mt-1 mb-2">{ticket.subject}</h2>
                <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded-xl border border-slate-850">
                  {ticket.description}
                </p>
              </div>

              {/* Status Timeline */}
              <div className="bg-[#12263F] border border-slate-800 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-white text-base mb-6 flex items-center space-x-2">
                  <span>📈</span>
                  <span>{t.ticket.timeline}</span>
                </h3>

                <div className="relative pl-6 border-l border-slate-800 space-y-6">
                  {ticket.timeline.map((h: TicketTimeline) => (
                    <div key={h.id} className="relative">
                      {/* Node Bullet */}
                      <span className="absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 border border-[#12263F]" />
                      
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500">
                          {new Date(h.createdAt).toLocaleDateString(isBg ? "bg-BG" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          {isBg ? "Промяна на статус: " : "Status change: "}
                          <span className="text-cyan-400">
                            {t.ticket.statuses[h.newStatus as keyof typeof t.ticket.statuses] || h.newStatus}
                          </span>
                        </h4>
                        {h.notes && (
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {h.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Communication Box */}
              <div className="bg-[#12263F] border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
                <div className="bg-slate-900/50 p-4 border-b border-slate-800/80 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">{t.ticket.messages}</h3>
                </div>

                {/* Messages Body */}
                <div className="flex-grow p-4 overflow-y-auto max-h-[300px] space-y-3 bg-[#0D1F35]/30">
                  {ticket.messages.length > 0 ? (
                    ticket.messages.map((m: TicketMessage) => {
                      const isClient = m.senderName !== "Инж. Димитър Петров" && !m.senderName.includes("Алми");
                      
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col max-w-[85%] space-y-1 ${
                            isClient ? "ml-auto items-end" : "mr-auto items-start"
                          }`}
                        >
                          <span className="text-[9px] text-slate-550 font-semibold uppercase">{m.senderName}</span>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isClient
                                ? "bg-blue-600 text-white rounded-tr-none shadow"
                                : "bg-[#1b3252] text-slate-200 rounded-tl-none border border-slate-800"
                            }`}
                          >
                            {m.message}
                          </div>
                          <span className="text-[9px] text-slate-600">
                            {new Date(m.createdAt).toLocaleTimeString(isBg ? "bg-BG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center py-12">
                      <p className="text-xs text-slate-500 italic">{t.ticket.noMessages}</p>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Message input footer */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-900/40 flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    placeholder={t.ticket.messagePlaceholder}
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    className="flex-grow bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !chatMsg.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                    aria-label="Send Message"
                  >
                    {sendingMsg ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackTicketPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07111F] pt-32 text-center text-slate-500 text-xs">
        Зареждане на проследяването...
      </div>
    }>
      <TrackTicketContent />
    </Suspense>
  );
}
