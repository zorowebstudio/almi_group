export const dynamic = "force-dynamic";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Folder, Download, Calendar, ShieldCheck, FileText } from "lucide-react";

export default async function PortalDocuments() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const isB2B = session.role === "CUSTOMER_COMPANY";
  const documentWhere = isB2B && session.companyId
    ? { companyId: session.companyId }
    : { userId: session.id };

  const documents = await prisma.document.findMany({
    where: documentWhere,
    orderBy: { createdAt: "desc" },
  });

  const getCategoryLabel = (category: string) => {
    const cats = t.portal.documents.categories as Record<string, string>;
    return cats[category] || category;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <Folder className="h-6 w-6 text-blue-400" />
          <span>{t.portal.documents.title}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Преглеждайте и сваляйте приемо-предавателни протоколи, фактури и становища от сервиза.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="bg-[#0D1F35] border border-slate-800 p-10 rounded-xl text-center space-y-3">
          <Folder className="h-10 w-10 text-slate-650 mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">
            {t.portal.documents.noDocs}
          </p>
          <p className="text-[10px] text-slate-550 max-w-sm mx-auto">
            След приключване на ремонт на хардуер или извършване на месечна абонаментна профилактика, тук ще бъде качен съответният приемо-предавателен протокол.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#0D1F35] border border-slate-800 p-5 rounded-xl flex items-center justify-between space-x-4 shadow-md hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex-shrink-0">
                  <FileText className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="text-xs font-bold text-white leading-tight truncate" title={doc.title}>
                    {doc.title}
                  </h3>
                  <p className="text-[9px] bg-slate-900 border border-slate-800 text-slate-450 px-2 py-0.5 rounded font-mono inline-block font-bold">
                    {getCategoryLabel(doc.category)}
                  </p>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>Качен на: {new Date(doc.createdAt).toLocaleDateString("bg-BG")}</span>
                  </div>
                </div>
              </div>

              <a
                href={doc.fileUrl || "#"}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center space-x-1.5 bg-[#12263F] hover:bg-slate-800 border border-slate-750 text-cyan-400 hover:text-white px-3 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Свали PDF</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Security Assurance Banner */}
      <div className="p-4 bg-slate-900/40 border border-slate-850/80 rounded-xl flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-450 leading-relaxed">
          <span className="font-bold text-slate-350 block">Защитено хранилище за документи</span>
          Всички протоколи и фактури се криптират по време на пренос и съхранение. Достъпът до тях е ограничен строго до Вашата компания и упълномощените системни техници.
        </div>
      </div>
    </div>
  );
}
