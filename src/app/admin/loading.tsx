"use client";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 select-none">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-blue-400 animate-pulse">
          Зареждане на администрацията
        </p>
        <p className="text-[10px] text-slate-500">
          Свързване със защитената база данни...
        </p>
      </div>
    </div>
  );
}
