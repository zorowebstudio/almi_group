import { prisma } from "@/lib/db";
import { Users, Building, Laptop, FileText, PlusCircle } from "lucide-react";

export default async function AdminClients() {
  const [users, companies] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["CUSTOMER_PRIVATE", "CUSTOMER_COMPANY"] } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.company.findMany({
      include: {
        members: true,
        devices: true,
        tickets: true
      },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="space-y-8 text-xs">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-400" />
          <span>Клиенти и Фирми (CRM)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          База данни с всички регистрирани физически лица и фирмени (B2B) акаунти.
        </p>
      </div>

      {/* Companies Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
          <Building className="h-4.5 w-4.5 text-cyan-400" />
          <span>Корпоративни Клиенти ({companies.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c.id} className="bg-[#0D1F35] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-xs font-bold text-white leading-tight">{c.name}</h3>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                  ЕИК: {c.eik || "Не е въведен"}
                </span>
              </div>

              {c.billingInfo && (
                <p className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-850 truncate">
                  {c.billingInfo}
                </p>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-450 border-t border-slate-850 pt-3">
                <div className="space-y-0.5">
                  <span className="text-slate-550 block font-bold">СЛУЖИТЕЛИ</span>
                  <span className="text-xs font-black text-white">{c.members.length} бр.</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-550 block font-bold">АКТИВИ</span>
                  <span className="text-xs font-black text-white">{c.devices.length} бр.</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-550 block font-bold">ЗАЯВКИ</span>
                  <span className="text-xs font-black text-white">{c.tickets.length} бр.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Private Clients Table */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
          <Users className="h-4.5 w-4.5 text-blue-400" />
          <span>Потребителски профили ({users.length})</span>
        </h2>

        <div className="bg-[#0D1F35] border border-slate-850 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-450 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Име</th>
                  <th className="py-3.5 px-5">Имейл</th>
                  <th className="py-3.5 px-5">Телефон</th>
                  <th className="py-3.5 px-5">Роля</th>
                  <th className="py-3.5 px-5">Регистрация</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#12263F]/20 transition-colors">
                    <td className="py-3 px-5 font-bold text-white">{u.name}</td>
                    <td className="py-3 px-5 font-mono text-slate-350">{u.email}</td>
                    <td className="py-3 px-5 text-slate-400">{u.phone || "—"}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        u.role === "CUSTOMER_COMPANY" ? "bg-cyan-950/40 text-cyan-400 border border-cyan-900/30" : "bg-slate-900 text-slate-450 border border-slate-800"
                      }`}>
                        {u.role === "CUSTOMER_COMPANY" ? "Фирма (B2B)" : "Частно лице"}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500 font-mono">
                      {new Date(u.createdAt).toLocaleDateString("bg-BG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
