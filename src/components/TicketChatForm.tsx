"use client";

import { useState, useTransition } from "react";
import { sendTicketMessage } from "@/app/portal/actions";
import { Send, Loader2 } from "lucide-react";

interface TicketChatFormProps {
  ticketId: string;
}

export default function TicketChatForm({ ticketId }: TicketChatFormProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    setError(null);
    startTransition(async () => {
      const result = await sendTicketMessage(ticketId, message);
      if (result.success) {
        setMessage("");
      } else {
        setError(result.error || "Неуспешно изпращане.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      {error && (
        <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      <div className="relative flex items-center">
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Напишете Вашето съобщение тук..."
          disabled={isPending}
          className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3.5 pr-14 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="absolute right-3.5 bottom-3.5 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-650 text-white rounded-lg transition-all"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
