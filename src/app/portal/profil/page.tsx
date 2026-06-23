import { getLocale } from "@/lib/locale";
import { translations } from "@/lib/translations";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import UserProfileForm from "@/components/UserProfileForm";
import { User, Shield } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PortalProfile() {
  const locale = await getLocale();
  const t = translations[locale];
  const session = await getUserSession();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      name: true,
      email: true,
      phone: true,
      role: true,
      languagePreference: true,
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <User className="h-6 w-6 text-blue-400" />
          <span>{t.portal.tabs.profile}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Преглеждайте и редактирайте личните си данни за достъп и комуникация.
        </p>
      </div>

      <div className="bg-[#0D1F35] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Account Info Read-Only */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-850">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Регистриран имейл (Вход)</span>
            <p className="text-sm font-extrabold text-white">{user.email}</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs self-start sm:self-center">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-400">Тип акаунт:</span>
            <span className="font-extrabold text-white">
              {t.enums?.userRoles[user.role as keyof typeof t.enums.userRoles] || user.role}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <UserProfileForm 
          initialData={{
            name: user.name,
            phone: user.phone,
            languagePreference: user.languagePreference,
          }}
        />
      </div>
    </div>
  );
}
