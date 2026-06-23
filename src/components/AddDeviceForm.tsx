"use client";

import { useState, useTransition } from "react";
import { createDevice } from "@/app/portal/actions";
import { PlusCircle, Loader2 } from "lucide-react";

interface AddDeviceFormProps {
  onSuccess?: () => void;
}

export default function AddDeviceForm({ onSuccess }: AddDeviceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState("DESKTOP");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [os, setOs] = useState("");
  const [notes, setNotes] = useState("");
  const [isNetworkAsset, setIsNetworkAsset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError("Наименованието е задължително.");
      return;
    }

    startTransition(async () => {
      const result = await createDevice({
        nickname,
        type,
        brand,
        model,
        serialNumber,
        os,
        notes,
        isNetworkAsset
      });

      if (result.success) {
        setNickname("");
        setBrand("");
        setModel("");
        setSerialNumber("");
        setOs("");
        setNotes("");
        setIsNetworkAsset(false);
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || "Неуспешно добавяне.");
      }
    });
  };

  return (
    <div className="bg-[#0D1F35] border border-slate-800 rounded-xl overflow-hidden p-5 shadow-md">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Регистрирай ново устройство</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850">
            <h3 className="text-sm font-extrabold text-white">Ново устройство</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Отказ
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Име на устройството *</label>
              <input
                type="text"
                placeholder="напр. Компютър счетоводство"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Тип устройство *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
              >
                <option value="DESKTOP">Настолен компютър</option>
                <option value="LAPTOP">Лаптоп</option>
                <option value="ROUTER">Рутер / Суич</option>
                <option value="PRINTER">Принтер / МФУ</option>
                <option value="SERVER">Сървър</option>
                <option value="OTHER">Друго оборудване</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Марка (Производител)</label>
              <input
                type="text"
                placeholder="напр. Dell, Lenovo, HP"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Модел</label>
              <input
                type="text"
                placeholder="напр. Latitude 5420"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Сериен номер (S/N)</label>
              <input
                type="text"
                placeholder="напр. CN-0XXXXX..."
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Операционна система</label>
              <input
                type="text"
                placeholder="напр. Windows 11 Pro, macOS"
                value={os}
                onChange={(e) => setOs(e.target.value)}
                className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Инсталиран софтуер / Специфични бележки</label>
            <textarea
              rows={2}
              placeholder="Специфични нужди, пароли, приложения или лицензи..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none resize-none text-white"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              id="network-asset"
              checked={isNetworkAsset}
              onChange={(e) => setIsNetworkAsset(e.target.checked)}
              className="rounded bg-slate-900 border-slate-850 text-blue-600 focus:ring-0"
            />
            <label htmlFor="network-asset" className="text-slate-300 font-semibold cursor-pointer">
              Критичен мрежов актив (рутер, сървър, NAS)
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Добави в инвентара</span>
          </button>
        </form>
      )}
    </div>
  );
}
