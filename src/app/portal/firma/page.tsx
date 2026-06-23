import { redirect, notFound } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { 
  addCompanyMember, removeCompanyMember, updateCompanyDetails 
} from "@/app/portal/actions";
import { 
  Building, Users, FileText, UserMinus, PlusCircle, 
  MapPin, ShieldAlert, Award, CreditCard 
} from "lucide-react";

export default async function PortalCompany() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  // Access check
  if (session.role !== "CUSTOMER_COMPANY" || !session.companyId) {
    redirect("/portal");
  }

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            }
          }
        }
      },
      addresses: true,
      devices: true,
      tickets: true
    }
  });

  if (!company) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("bg-BG");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <Building className="h-6 w-6 text-blue-400" />
          <span>{t.portal.company.title}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Управление на фирмени данни, фактуриране, достъп на Вашите служители и текущи ИТ планове.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Firm details & Team management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details Update Form */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Данни за фирмата
            </h2>

            <form action={async (formData: FormData) => {
              "use server";
              const name = formData.get("name") as string;
              const eik = formData.get("eik") as string;
              const billingInfo = formData.get("billingInfo") as string;
              await updateCompanyDetails({ name, eik, billingInfo });
            }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Наименование на юридическо лице</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={company.name}
                    required
                    className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">{t.portal.company.eik} (Булстат)</label>
                  <input
                    type="text"
                    name="eik"
                    defaultValue={company.eik || ""}
                    placeholder="EIK номер"
                    className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">{t.portal.company.billingAddress}</label>
                <textarea
                  name="billingInfo"
                  rows={2}
                  defaultValue={company.billingInfo || ""}
                  placeholder="Адрес за фактуриране, МОЛ..."
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none resize-none text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer"
              >
                Обнови данните
              </button>
            </form>
          </div>

          {/* Team Members List */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="h-4.5 w-4.5 text-blue-400" />
              <span>{t.portal.company.team}</span>
            </h2>

            <div className="divide-y divide-slate-850">
              {company.members.map((member) => (
                <div key={member.id} className="py-3.5 flex items-center justify-between hover:bg-[#12263F]/20 px-2 rounded-lg transition-all text-xs">
                  <div className="min-w-0 pr-4 space-y-0.5">
                    <p className="font-extrabold text-white truncate">{member.user.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{member.user.email}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      member.role === "OWNER" ? "bg-cyan-950 border-cyan-900 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}>
                      {member.role === "OWNER" ? "Собственик" : "Служител"}
                    </span>

                    {member.role !== "OWNER" && (
                      <form action={async () => {
                        "use server";
                        await removeCompanyMember(member.id);
                      }}>
                        <button
                          type="submit"
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-all cursor-pointer"
                          title="Премахни служител"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Team Member Form */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Покани нов служител
              </h3>

              <form action={async (formData: FormData) => {
                "use server";
                const email = formData.get("email") as string;
                await addCompanyMember(email);
              }} className="flex items-center gap-2 text-xs">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Имейл адрес на колега..."
                  className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2.5 rounded-lg transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Добави</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right 1 Column: IT environment stats & active contracts */}
        <div className="space-y-6">
          {/* Subscription plan */}
          <div className="bg-[#0D1F35] border border-slate-800 p-6 rounded-xl space-y-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Абонаментен договор
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-3">
                <Award className="h-8 w-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black">Текущ абонамент</p>
                  <p className="font-extrabold text-white text-sm">ИТ План „СТАРТ БИЗНЕС“</p>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-slate-400 leading-normal">
                <div className="flex justify-between pb-1.5 border-b border-slate-850">
                  <span>Статус на договора:</span>
                  <span className="text-green-400 font-extrabold">АКТИВЕН</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-850">
                  <span>Поддържани работни места:</span>
                  <span className="text-white font-semibold">До 10 бр.</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-850">
                  <span>Реакция при критичен срив:</span>
                  <span className="text-white font-semibold">До 2 часа</span>
                </div>
                <div className="flex justify-between">
                  <span>Следваща профилактика:</span>
                  <span className="text-cyan-400 font-bold">Юли 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environment brief stats */}
          <div className="bg-[#0D1F35]/60 border border-slate-850 p-6 rounded-xl space-y-3.5 shadow-md">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.portal.company.env}
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-850">
                <span className="text-slate-500">Регистриран хардуер:</span>
                <span className="text-white font-extrabold">{company.devices.length} бр.</span>
              </div>

              <div className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-850">
                <span className="text-slate-500">Общо отворени казуси:</span>
                <span className="text-white font-extrabold">
                  {company.tickets.filter(t => !["COMPLETED", "CANCELLED"].includes(t.status)).length} бр.
                </span>
              </div>

              <div className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-850">
                <span className="text-slate-500">Исторически заявки:</span>
                <span className="text-white font-extrabold">{company.tickets.length} бр.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
