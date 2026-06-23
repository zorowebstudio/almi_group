"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { sendChatMessage } from "@/app/portal/actions";
import { Send, Loader2, MessageSquare, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  senderId: string | null;
  senderName: string;
  message: string;
  createdAt: string | Date;
}

interface PortalChatWindowProps {
  conversationId: string;
  initialMessages: Message[];
  currentUserId: string;
}

export default function PortalChatWindow({
  conversationId,
  initialMessages,
  currentUserId,
}: PortalChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom on load/new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync state with parent server updates
  useEffect(() => {
    requestAnimationFrame(() => {
      setMessages(initialMessages);
    });
  }, [initialMessages]);

  // Periodically refresh the route to pull incoming technician responses (simulated real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(interval);
  }, [router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isPending) return;

    const text = inputValue;
    setInputValue("");

    // Optimistic update
    const tempId = Math.random().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: currentUserId,
        senderName: "Вие",
        message: text,
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const res = await sendChatMessage(conversationId, text);
      if (!res.success) {
        // Rollback optimistic update
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert(res.error || "Грешка при изпращане.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-[#0D1F35] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[550px]">
      {/* Chat Header */}
      <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Онлайн съдействие</h3>
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wide">
              Дежурен кабинет поддръжка
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-450">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-semibold text-slate-400">На линия</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-slate-950/20">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const isBot = msg.senderName.includes("Бот") || msg.senderName.includes("Асистент");
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 mb-1">
                {isBot && <Bot className="h-3 w-3 text-cyan-400" />}
                <span className="font-bold">{msg.senderName}</span>
                <span>•</span>
                <span>
                  {new Date(msg.createdAt).toLocaleTimeString("bg-BG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isMe
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : isBot
                    ? "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none"
                    : "bg-[#12263F] border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Напишете Вашето запитване към дежурния техник..."
            disabled={isPending}
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-3.5 pl-4 pr-12 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending || !inputValue.trim()}
            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-650 text-white rounded-lg transition-all cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
