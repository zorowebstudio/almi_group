"use client";

export default function PortalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 select-none">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">
          Зареждане на портала
        </p>
        <p className="text-[10px] text-slate-500">
          Моля, изчакайте, докато извличаме Вашите технически данни...
        </p>
      </div>
    </div>
  );
}
