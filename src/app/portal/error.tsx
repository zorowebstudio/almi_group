"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portal error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      <div className="p-4 bg-red-950/20 border border-red-900/30 text-red-400 rounded-full">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-base font-black text-white uppercase tracking-wider">
          Възникна техническа грешка
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Системата не успя да зареди желаната страница в клиентския портал. Това може да е причинено от временен проблем с връзката.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Опитай отново</span>
      </button>
    </div>
  );
}
