import { prisma } from "@/lib/db";
import { Folder, Download, Calendar, ShieldCheck, FileText, User } from "lucide-react";

export default async function AdminDocuments() {
  const documents = await prisma.document.findMany({
    include: {
      company: { select: { name: true } },
      user: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "OFFER": return "Търговско предложение";
      case "DIAGNOSTIC_REPORT": return "Протокол от диагностика";
      case "SERVICE_PROTOCOL": return "Сервизен протокол";
      case "INVOICE": return "Фактура (копие)";
      default: return "Друг документ";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <Folder className="h-6 w-6 text-blue-400" />
          <span>Архив Документи</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Преглед и одит на всички издадени технически протоколи, оферти и копия на фактури.
        </p>
      </div>

      <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md text-xs">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Всички документи в системата ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <p className="text-center text-slate-500 py-6">Няма издадени документи в архива.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-450 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Документ</th>
                  <th className="py-3 px-4">Категория</th>
                  <th className="py-3 px-4">Клиент / Фирма</th>
                  <th className="py-3 px-4">Издаден от</th>
                  <th className="py-3 px-4">Дата</th>
                  <th className="py-3 px-4 text-right">Свали</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#12263F]/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-white max-w-[240px] truncate" title={doc.title}>
                      {doc.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {getCategoryLabel(doc.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {doc.company?.name || doc.user?.name || "Връзка с гост"}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{doc.uploadedBy || "Система"}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(doc.createdAt).toLocaleDateString("bg-BG")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={doc.fileUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center space-x-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
