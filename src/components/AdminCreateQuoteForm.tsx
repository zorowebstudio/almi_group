"use client";

import { useState, useTransition } from "react";
import { createQuote } from "@/app/portal/actions";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketOption {
  id: string;
  ticketNumber: string;
  subject: string;
  name: string;
}

interface AdminCreateQuoteFormProps {
  tickets: TicketOption[];
}

export default function AdminCreateQuoteForm({ tickets }: AdminCreateQuoteFormProps) {
  const [ticketId, setTicketId] = useState("");
  const [expiryDays, setExpiryDays] = useState(14);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    { description: "Часове техническа поддръжка", quantity: 1, unit: "час", unitPrice: 60 }
  ]);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { description: "", quantity: 1, unit: "бр.", unitPrice: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!ticketId) {
      setError("Моля, изберете заявка.");
      return;
    }

    const invalidItem = items.find(i => !i.description.trim() || i.quantity <= 0 || i.unitPrice < 0);
    if (invalidItem) {
      setError("Моля попълнете коректно описанията, количествата и цените на всички редове.");
      return;
    }

    startTransition(async () => {
      const res = await createQuote({
        ticketId,
        expiryDays,
        notes: notes || undefined,
        items
      });

      if (res.success) {
        setSuccess(true);
        setTicketId("");
        setNotes("");
        setItems([{ description: "ИТ услуги", quantity: 1, unit: "бр.", unitPrice: 60 }]);
        router.refresh();
      } else {
        setError(res.error || "Неуспешно генериране.");
      }
    });
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-5 shadow-md text-xs text-slate-305">
      <h3 className="text-sm font-extrabold text-white pb-2 border-b border-slate-850">
        Издай Нова Оферта
      </h3>

      {error && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-950/20 border border-green-900/30 text-green-400 rounded-lg font-bold">
          Офертата е изпратена успешно! Статусът на заявката е променен на „Изпратена оферта“.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ticket Selector */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Заявка от клиент *</label>
          <select
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white"
          >
            <option value="">-- Изберете казус --</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.ticketNumber} - {t.name} ({t.subject})
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Days */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Валидност на офертата (дни)</label>
          <input
            type="number"
            value={expiryDays}
            onChange={(e) => setExpiryDays(parseInt(e.target.value))}
            min={1}
            required
            className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white font-semibold"
          />
        </div>
      </div>

      {/* Quote Items Block */}
      <div className="space-y-3.5 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Редове в офертата</span>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Добави ред</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-850 items-center">
              <div className="sm:col-span-6 space-y-0.5">
                <input
                  type="text"
                  placeholder="Описание на услугата / продукта"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  placeholder="Кол."
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded text-white text-center font-bold"
                />
              </div>

              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="ед."
                  value={item.unit}
                  onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                  className="w-full bg-slate-955 border border-slate-850 p-2 rounded text-white text-center"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  placeholder="Ед. цена"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-955 border border-slate-850 p-2 rounded text-white text-right font-bold text-cyan-400"
                />
              </div>

              <div className="sm:col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 uppercase font-bold">Пояснителни бележки към цената</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="напр. Цената включва необходимия хардуер и монтаж..."
          className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-white resize-none"
        />
      </div>

      {/* Calculations & Submit */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-800 gap-4">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">ОБЩА СТОЙНОСТ С ДДС</span>
          <p className="text-xl font-black text-cyan-400">{calculateTotal().toFixed(2)} лв.</p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-450 text-slate-950 font-black text-xs rounded-lg shadow-md flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Изпрати офертата до клиента</span>
        </button>
      </div>
    </form>
  );
}
