"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      <div className="p-4 bg-yellow-950/20 border border-yellow-800/40 text-yellow-500 rounded-full animate-pulse">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-base font-black text-white uppercase tracking-wider">
          Грешка при зареждане на администрацията
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Не успяхме да заредим административните данни. Моля, проверете мрежовата си връзка или опитайте повторно зареждане.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Опитай отново</span>
      </button>
    </div>
  );
}
